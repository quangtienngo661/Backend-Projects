const catchAsync = require("../utils/catchAsync.util");
const cartService = require("../services/cart.service")

const productsInCart = catchAsync(async (req, res, next) => {
    const userCart = await cartService.productsInCart(req, res, next);
    return res.ok(userCart, 200);
})

const addToCart = catchAsync(async (req, res, next) => {
    const newProductAdded = await cartService.addToCart(req, res, next);
    // return res.ok(userCart, 200);
    return res.ok(newProductAdded, 201)
})

const removeFromCart = catchAsync(async (req, res, next) => {
    const cartAfterRemovingItem = await cartService.removeFromCart(req, res, next);
    return res.ok(cartAfterRemovingItem, 200)
})

const updateItemQuantity = catchAsync(async (req, res, next) => {
    const updatedCart = await cartService.updateItemQuantity(req, res, next);
    return res.ok(updatedCart, 200)
})

const cleanCart = catchAsync(async (req, res, next) => { // optional

})

module.exports = {
    productsInCart, addToCart, removeFromCart, updateItemQuantity, cleanCart
}