const paymentService = require("../services/external-services/payment/payment.service");
const catchAsync = require("../utils/catchAsync.util");

// TODO: re-structure code
const pay = async (order, paymentMethod) => { // used in order service, 
    const paymentResult = await paymentService.pay(order, paymentMethod);
    return paymentResult;
}

const paymentCallback = catchAsync(async (req, res, next) => {
    const onlinePaidOrder = await paymentService.paymentCallback(req, res, next);
    console.log(onlinePaidOrder)
    return res.ok(onlinePaidOrder, 200)
}) 

module.exports = { pay, paymentCallback }