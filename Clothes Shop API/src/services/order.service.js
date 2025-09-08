const { default: mongoose } = require("mongoose");
const Cart = require("../models/Cart.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const AppError = require("../utils/AppError.util");
const { pay } = require('../controllers/payment.controller')
const paymentSevice = require('../services/payment/payment.service')

exports.createOrder = async (req, res, next) => {
    // TODO: comment session when developing
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { selectedItems, shippingAddress, phone, paymentMethod } = req.body;
        const userId = req.user.id;

        selectedItems.forEach(itemId => {
            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                throw new AppError(`Invalid item ID: ${itemId}`, 400);
            }
        });

        if (!selectedItems || selectedItems.length === 0) {
            throw new AppError("No items selected for order", 400);
        }

        if (!shippingAddress || !phone || !paymentMethod) {
            throw new AppError("Missing order information, please provide all the required fields", 400)
        }

        const userCart = await Cart.findOne({ user: userId })
            .populate("items.product")
            .session(session);
        if (!userCart) {
            throw new AppError("User's cart not found", 404);
        }

        const selectedCartItems = userCart.items.filter(
            item => selectedItems.includes(item._id.toString())
        )

        if (selectedCartItems.length !== selectedItems.length) {
            throw new AppError("Some selected items not found in cart", 400);
        }

        for (const cartItem of selectedCartItems) {
            if (!cartItem.product.isActive) {
                throw new AppError(`Product ${cartItem.product._id} is no longer available`, 409);
            }

            const updated = await Product.updateOne(
                {
                    _id: cartItem.product._id,
                    stock: { $gte: cartItem.quantity }
                },
                { $inc: { stock: -cartItem.quantity } },
                { session }
            );
            if (!updated.matchedCount || !updated.modifiedCount) {
                throw new AppError(`Not enough stock for product ${cartItem.product._id}`, 409);
            }
        }

        const itemsToOrder = selectedCartItems.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price * (1 - item.product.discount / 100), // including discount
            size: item.size,
            color: item.color
        }))

        const total = itemsToOrder.reduce((sum, item) => {
            return sum + item.price * item.quantity
        }, 0);

        const [newOrder] = await Order.create([
            {
                user: userId,
                items: itemsToOrder,
                shippingAddress,
                phone,
                paymentMethod,
                shippingCode: `ORDER-${Date.now()}`,
                total: total.toFixed(2)
            }],
             { session }
        );

        userCart.items = userCart.items.filter(item => {
            return !selectedItems.includes(item._id.toString())
        });

        await userCart.save({ session });
        // await userCart.save();
        await session.commitTransaction();

        if (paymentMethod !== 'COD') {
            const paymentResult = await paymentSevice.pay(newOrder, paymentMethod);
            return paymentResult
        }

        return newOrder;
    } catch (error) {
        await session.abortTransaction();
        throw new AppError("Aborted transaction: " + error.message, 409);
    } finally {
        session.endSession();
    }
}

exports.cancelOrder = async (req, res, next) => {
    // TODO: comment session when developing
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // TODO: check payment status - in case user has a transaction, will handle returning user's money
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        }, { session }).populate("items.product");

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.status === "shipping" || order.status === "delivered" || order.status === "canceled") {
            throw new AppError("Order cannot be canceled while it is being shipped or already canceled", 409)
        }

        order.status = "canceled";
        // TODO: check the payment status, if unpaid, pass, else handle returning money back to the customer

        await order.save({ session });
        // await order.save();

        for (const item of order.items) {
            const result = await Product.updateOne(
                {
                    _id: item.product._id,
                    isActive: true
                },
                { $inc: { stock: item.quantity } },
                { session }
            )

            if (!result.matchedCount || !result.modifiedCount) {
                throw new AppError(`Error modifying stock information`, 409);
            }
        }

        await session.commitTransaction();
        return order;
    } catch (error) {
        await session.abortTransaction();
        throw new AppError("Aborted transaction: " + error.message, 409);
    } finally {
        await session.endSession();
    }
}

exports.getOrders = async (req, res, next) => {
    let orders;
    if (req.user.role === 'user')
        orders = await Order.find({ user: req.user.id }).populate("items.product");
    else
        orders = await Order.find().populate("items.product");
    return orders;
}

exports.getOrder = async (req, res, next) => {
    const { orderId } = req.params;

    const query = req.user.role === 'admin'
        ? { _id: orderId }
        : { _id: orderId, user: req.user.id }

    const order = await Order.findOne(query).populate("items.product");
    if (!order) {
        throw new AppError("Order not found", 404);
    }
    return order;
}

exports.updatePaymentStatus = async (req, res, next) => {

}

// Admin Only
exports.updateOrderStatus = async (req, res, next) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body

    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
        throw new AppError("Order not found", 404);
    }

    const validStatus = ['pending', 'confirmed', 'shipping', 'delivered', 'canceled'];
    if (!validStatus.includes(orderStatus)) {
        throw new AppError("Order status is not valid, please select a valid one!", 400);
    }

    order.status = orderStatus;
    await order.save();

    return order;
}
