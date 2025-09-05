const { default: mongoose } = require("mongoose");
const Cart = require("../models/Cart.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const AppError = require("../utils/AppError.util");

exports.createOrder = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { selectedItems, shippingAddress, phone, paymentMethod } = req.body;
        const userId = req.user.id;

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


        for (const cartItem of selectedCartItems) {
            const updated = await Product.updateOne( // consider using updateOne
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
        // 5) (Tuỳ chọn) Kiểm tra paymentMethod/ tạo paymentIntent (Stripe) TRƯỚC khi tạo order
        // Lưu ý: Stripe là hệ thống ngoài DB → không rollback được khi abortTransaction.
        // Gợi ý an toàn: Tạo order ở trạng thái pending, trả client_secret, xác nhận thanh toán xong mới chuyển trạng thái.
        // TODO:
        // let clientSecret = null;
        // if (paymentMethod === 'card') {
        //   const paymentIntent = await stripe.paymentIntents.create(...);
        //   clientSecret = paymentIntent.client_secret;
        // }

        const [newOrder] = await Order.create([
            {
                user: userId,
                items: itemsToOrder,
                shippingAddress,
                phone,
                paymentMethod,
                shippingCode: `ORDER-${Date.now()}`,
                total: total.toFixed(2)
            }], { session }
        );


        userCart.items = userCart.items.filter(item => {
            return !selectedItems.includes(item._id.toString())
        })


        await userCart.save({ session });
        await session.commitTransaction();

        return newOrder;
    } catch (error) {
        await session.abortTransaction();
        throw new AppError("Aborted transaction: " + error.message, 409)
    } finally {
        session.endSession();
    }
}

exports.cancelOrder = async (req, res, next) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new AppError("Order not found", 404);
    }

    if (order.status === "shipping" || order.status === "delivered" || order.status === "canceled") {
        throw new AppError("Order cannot be canceled while it is being shipped or already canceled", 409)
    }

    order.status = "canceled";
    await order.save();

    return order;
}

exports.orderHistory = async (req, res, next) => {
    const orderHistory = await Order.find({user: req.user.id});
    return orderHistory;
}