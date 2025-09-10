const { body } = require('express-validator');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError.util');

const createOrderValidation = [
    body('selectedItems')
        .isArray().withMessage("Selected items must be an array")
        .custom(selectedItems => {
            selectedItems.forEach((item, index) => {
                if (!mongoose.Types.ObjectId.isValid(item)) {
                    throw new AppError(`Product ID is invalid at index ${index + 1}`);
                }
            });
            return true;
        }),

    body("shippingAddress")
        .notEmpty().withMessage("Shipping address is required")
        .isString().withMessage("Shipping address must be a string")
        .isLength({ max: 100 }).withMessage("Shipping address must not be over 100 characters"),

    body("phone")
        .notEmpty().withMessage("Mobile phone is required")
        .isString().withMessage("Mobile phone must be a string")
        .isMobilePhone("vi-VN").withMessage("Mobile phone is invalid"),

    body("paymentMethod")
        .notEmpty().withMessage("Payment method is required")
        .isString().withMessage("Payment method must be a string"),
];

module.exports = { createOrderValidation };
