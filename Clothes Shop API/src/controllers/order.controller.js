const catchAsync = require("../utils/catchAsync.util");
const orderService = require("../services/order.service")

// User access
const createOrder = catchAsync(async (req, res, next) => {
    const newOrder = await orderService.createOrder(req, res, next);
    return res.ok(newOrder, 201)
})

const cancelOrder = catchAsync(async (req, res, next) => {
    const canceledOrder = await orderService.cancelOrder(req, res, next);
    return res.ok(canceledOrder)
})

const orderHistory = catchAsync(async (req, res, next) => {
    const orderHistory = await orderService.orderHistory(req, res, next);
    return res.ok(orderHistory, 200)
})

// Admin access (cannot interrupt users' actions, ex: changing user's address
// But if a user doesn't follow app's policy, admin can access user's permission)
const updateOrderState = catchAsync(async (req, res, next) => { // admin only
    // TODO: update order state
})

module.exports = { createOrder, cancelOrder, orderHistory }