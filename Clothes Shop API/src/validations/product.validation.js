const { body, query, param } = require('express-validator');
const Product = require('../models/Product.model');
const AppError = require('../utils/AppError.util');

// TODO: Finish all the validation (last modified: 11h00pm 27/8/2025), re-check validation
const createAndUpdateProductValidation = [
    body('name')
        .notEmpty()
        .withMessage("Name cannot be empty!")
        .isString()
        .withMessage('Name must be a string type!')
        .trim()
        .custom(async (name) => {
            const existingProduct = await Product.findOne({ name: name })
            if (existingProduct) {
                throw new AppError("Products' name existed!");
            }
            return true;
        })
        .isLength({ min: 2, max: 100 })
        .withMessage("Name length must be between 2 and 100 characters"),
    // Sanitize explaination

    body('price')
        .notEmpty()
        .withMessage("Price cannot be empty!")
        .isFloat({ min: 0.01 })
        .withMessage('Name must be a positive number'),

    body('category')
        .notEmpty()
        .withMessage("Category cannot be empty!")
        .isString()
        .withMessage('Category must be a string type!')
        .isLength({ min: 2, max: 50 })
        .withMessage("Name length must be between 2 and 100 characters")
        .trim(),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Description's maximum length must be 1000 characters")
        .trim(),

    body('discount')
        .optional()
        .isFloat({ min: 0, max: 1000 })
        .withMessage('Discount value must be a positive number'),

    body('sizes')
        .optional()
        .isArray()
        .withMessage("Size's format must be an array"),
    // TODO: custom validation for each element of sizes array

    body('colors')
        .optional()
        .isArray()
        .withMessage("Colors format must be an array")
        .custom(async (colors) => {
            if (colors && colors.length > 0) {
                if (colors.length > 20) {
                    throw new AppError('Maximum 20 colors allowed')
                }

                for (let i = 0; i < colors.length; i++) {
                    let color = colors[i];

                    if (typeof color !== 'string') {
                        throw new AppError('Each element of colors array must be a string')
                    }

                    let trimmedColor = color.trim();
                    if (trimmedColor.length < 2 || trimmedColor.length > 30) {
                        throw new Error(`Color "${color}" must be between 2-30 characters`);
                    }

                    // Valid color format - Text or hex codes (COPILOT reference)
                    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(trimmedColor);
                    const isValidColorName = /^[a-zA-Z\s]+$/.test(trimmedColor);

                    if (!isValidHex && !isValidColorName) {
                        throw new Error(`Color "${color}" must be a valid color name or hex code`);
                    }
                }

                const normalizedColors = colors.map(color => color.trim().toLowerCase());
                const uniqueColors = [...new Set(normalizedColors)];
                if (uniqueColors.length !== normalizedColors.length) {
                    throw new AppError('Duplicates color are not allowed!')
                }
            }
            return true;
        }),

    body('stock')
        .optional()
        .isInt({ min: 0, max: 999999 })
        .withMessage("Stock's value must be a positive number and less than 999999"),

    body('images')
        .optional()
        .isArray()
        .withMessage("Images format must be an array")
        // Custom: COPILOT reference (WARNING)
        .custom((images) => {
            if (images && images.length > 0) {
                images.forEach((img, index) => {
                    if (typeof img !== 'string') {
                        throw new Error(`Image at index ${index} must be a string`);
                    }
                    if (!img.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i)) {
                        throw new Error(`Image "${img}" must be a valid image URL`);
                    }
                    if (img.length > 500) {
                        throw new Error(`Image URL at index ${index} too long (max 500 characters)`);
                    }
                });
            }
            return true;
        }),

    // isActive validation: COPILOT reference (WARNING)
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value')
];

// TODO: bulk create validation and custom validation for each documents of products array
const bulkCreateProductValidation = (product) => {
    const { 
        name, 
        description, 
        price, 
        discount, 
        sizes, 
        colors, 
        stock, 
        images, 
        category,  
        isActive
    } = product;

    if (typeof name !== 'String') {
        throw new AppError("Name must be a string type", 400);
    }

    if (name.length < 2 || name.length > 100) {
        throw new AppError("Name's length must be between 2 and 100 characters");
    }

    if (typeof description !== 'String') {
        throw new AppError("Description must be a string type", 400);
    }

    if (description.length > 1000) {
        throw new AppError("Description's length mustn't be over 1000 characters");
    }

}

module.exports = { 
    createAndUpdateProductValidation, 
}