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

const getOrders = catchAsync(async (req, res, next) => {
    const orders = await orderService.getOrders(req, res, next);
    return res.ok(orders, 200)
})

const getOrder = catchAsync(async (req, res, next) => {
    const order = await orderService.getOrder(req, res, next);
    return res.ok(order, 200)
})

// Admin access (cannot interrupt users' actions, ex: changing user's address
// But if a user doesn't follow app's policy, admin can access user's permission)
const updateOrderStatus = catchAsync(async (req, res, next) => { // admin only
    const updatedOrderStatus = await orderService.updateOrderStatus(req, res, next);
    return res.ok(updatedOrderStatus, 200);
})

module.exports = { createOrder, cancelOrder, getOrders, getOrder, updateOrderStatus }