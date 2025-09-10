const { body, query, param } = require('express-validator');
const Product = require('../models/Product.model');
const AppError = require('../utils/AppError.util');
const Cart = require('../models/Cart.model');

const addItemValidation = [
    body("product")
        .isMongoId()
        .withMessage("The product ID must be a valid MongoID")
        .notEmpty()
        .withMessage("The product ID is required")
        .custom(async (product, { req }) => { // .custom(input, meta: { req, location, path })
            const existingProduct = await Product.findById(product);
            if (!existingProduct) {
                throw new AppError("Product not found", 404);
            }

            req.productData = existingProduct;
            return true;    
        }),

    body("quantity")
        .isInt({ min: 1 })
        .withMessage("The minimum of quantity must be 1")
        .custom(async (quantity, { req }) => {
            const { size, color } = req.body;

            const existingProduct = req.productData;

            if (quantity > existingProduct.stock) {
                throw new AppError("Item quantity must be less than product's stock", 400);
            }

            const userCart = await Cart.findOne({ user: req.user.id });

            if (userCart) {
                const existingItem = userCart.items.find(
                    (item) =>
                        item.product.toString() === existingProduct._id &&
                        item.color === color &&
                        item.size === size
                )

                if (existingItem && existingItem.quantity + quantity > existingProduct.stock)
                    throw new AppError(
                        `Only ${existingProduct.stock - existingItem.quantity} more products can be added into cart!`, 400
                    );
            }

            return true;
        }),

    body("size")
        .notEmpty()
        .withMessage("Size is required!")
        .isString()
        .withMessage("Size must be a string")
        .custom(async (size, { req }) => {
            const sizes = req.productData?.sizes || [];

            if (size && !sizes.includes(size)) {
                throw new AppError("The product doesn't have this size")
            }

            return true;
        }),

    body("color")
        .notEmpty()
        .withMessage("Color is required!")
        .isString()
        .withMessage("Color must be a string")
        .custom(async (color, { req }) => {
            const colors = req.productData?.colors || [];

            if (color && !colors.includes(color)) {
                throw new AppError("The product doesn't have this color")
            }

            return true;
        }),
]

module.exports = { addItemValidation }
