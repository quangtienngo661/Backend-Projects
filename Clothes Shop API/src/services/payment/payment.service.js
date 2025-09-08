//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters

const Order = require('../../models/Order.model');
const Product = require('../../models/Product.model');
const AppError = require('../../utils/AppError.util');
const momoPayment = require('./momo.adapter');

exports.pay = async (order, paymentMethod) => {
    let paymentResult;

    console.log("pay service")

    switch (paymentMethod) {
        case 'momo':
            paymentResult = await momoPayment(order);
            break;
        case 'zalopay':
            paymentResult = "zalopay api will be handled later"
            break;

        default:
            throw new AppError("Unsupported payment method", 400);
    }

    return paymentResult;
}

exports.paymentCallback = async (req, res, next) => {
    const callbackInfo = { ...req.query };

    const order = await Order.findById(callbackInfo.orderId).populate("items.product");
    if (!order) {
        throw new AppError("Order not found", 404);
    }

    console.log(order)
    // Prevent duplicate processing
    if (order.paymentStatus === 'paid') {
        return order;
    }


    let paymentSuccess = false;

    switch (callbackInfo.partnerCode) {
        case 'MOMO':
            paymentSuccess = callbackInfo.resultCode === "0";
            break;
        case 'ZALOPAY':
            paymentSuccess = callbackInfo.resultCode === 1;
            break;

        default:
            throw new AppError("Unsupported payment method", 400);
    }

    if (paymentSuccess) {
        order.status = 'confirmed';
        order.paymentStatus = 'paid';
        await order.save();
    } else { // in case of fail tracsaction
        for (item of order.items) {
            const reservedProduct = await Product.updateOne(
                {
                    _id: item.product._id.toString(),
                    stock: { $gte: item.quantity },
                    isActive: true
                },
                { $inc: { stock: item.quantity } }
            )

            if (!reservedProduct.matchedCount) {
                console.warn(`Could not restore stock for product ${item.product._id}`);
                // Don't throw error here, log and continue
            }
        }

        order.status = 'canceled';
        order.paymentStatus = 'failed';
    }

    return order
}