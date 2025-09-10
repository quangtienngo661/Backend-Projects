const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const AppError = require('../utils/AppError.util');

exports.productsInCart = async (req, res, next) => {
    const { id } = req.user;
    const userCart = await Cart.findOne({ user: id }).populate('items.product');

    if (!userCart) {
        throw new AppError("User's cart not found", 404);
    }

    const cartSummary = {
        totalItems: userCart.items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: userCart.items.reduce((sum, item) => {
            const price = item.product.price * (1 - item.product.discount / 100);
            return sum + price * item.quantity;
        }, 0)
    }

    return {
        cart: userCart,
        summary: cartSummary
    };
}

exports.addToCart = async (req, res, next) => {
    const userId = req.user.id;
    const { product, quantity = 1, size, color } = req.body;

    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
        throw new AppError("User's cart not found", 404)
    }

    const existingProduct = await Product.findById(product)

    if (existingProduct.stock === 0) {
        throw new AppError("This product is out of stock!");
    }

    if (quantity > existingProduct.stock) {
        throw new AppError("Item's quantity mustn't be greater than product's stock!");
    }

    const existingCartItem = userCart.items.find(
        item =>
            item.product._id.toString() === product &&
            item.size === size &&
            item.color === color
    )

    if (existingCartItem) {
        existingCartItem.quantity += quantity;
    } else {
        userCart.items.push({
            product,
            quantity,
            size,
            color
        })
    };

    const updatedCart = await userCart.save();
    await updatedCart
        .populate({
            path: "items.product",
            select: "_id name discount"
        })

    return updatedCart;
}

exports.removeFromCart = async (req, res, next) => {
    const userId = req.user.id;
    const { itemId } = req.params

    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
        throw new AppError("User's cart not found", 404)
    }

    const itemIndex = userCart.items.findIndex(
        item => item._id.toString() === itemId
    );


    if (itemIndex === -1) {
        throw new AppError("Item not found in cart", 404);
    }

    const existingProduct = await Product.findById(userCart.items[itemIndex].product);
    if (!existingProduct) {
        throw new AppError("Product not found", 404);
    }

    userCart.items.splice(itemIndex, 1);

    const cartAfterRemovingItem = await userCart.save();
    await cartAfterRemovingItem.populate('items.product');

    return cartAfterRemovingItem;
}

exports.updateItemQuantity = async (req, res, next) => {
    const { modification } = req.body;
    const { itemId } = req.params;
    const userId = req.user.id;


    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
        throw new AppError("User's cart not found", 404)
    }

    const itemIndex = userCart.items.findIndex(
        item => {
            return item._id.toString() === itemId
        }
    );

    if (itemIndex === -1) {
        throw new AppError("Item not found in cart", 404);
    }

    const existingProduct = await Product.findById(userCart.items[itemIndex].product);
    if (!existingProduct) {
        throw new AppError("Product not found", 404);
    }

    if (modification === '+') {
        if (userCart.items[itemIndex].quantity === existingProduct.stock) {
            throw new AppError("Cannot add more, reached available stock", 409)
        }
        userCart.items[itemIndex].quantity += 1;
    } else if (modification === '-') {
        if (userCart.items[itemIndex].quantity === 1) {
            userCart.items.splice(itemIndex, 1);
        } else {
            userCart.items[itemIndex].quantity -= 1;
        }
    } else {
        throw new AppError("Modification command is invalid, please try again!", 400)
    }

    const updatedCart = await userCart.save();
    await updatedCart.populate('items.product');

    return updatedCart;
}

exports.cleanCart = async (req, res, next) => {
    const userId = req.user.id
    const userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
        throw new AppError("User's cart not found", 404)
    }

    userCart.items.splice(0, userCart.items.length);
    await userCart.save();

    return userCart;
}