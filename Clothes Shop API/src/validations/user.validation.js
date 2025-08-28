const { body, query } = require('express-validator')

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('The input string is not an email format, please try again!')
        .notEmpty()
        .withMessage('The email must not be blank!')
        .trim()
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('The minimum length of password must be 6 characters!')
        // .isStrongPassword()
        // .withMessage('The password is not strong enough!')
        .notEmpty()
        .withMessage("The password must be not empty!")
];

const registerValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required!')
        .isString()
        .withMessage('Name must be a string!')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2-50 characters!')
        .trim(),

    body('email')
        .isEmail()
        .withMessage('The input string is not an email format, please try again!')
        .notEmpty()
        .withMessage('The email must not be blank!')
        .trim()
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('The minimum length of password must be 6 characters!')
        // .isStrongPassword()
        // .withMessage('The password is not strong enough!')
        .notEmpty()
        .withMessage("The password must be not empty!"),

    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage("Role must be either 'user' or 'admin'"),

    body('address')
        .optional()
        .isString()
        .withMessage('Address must be a string!')
        .isLength({ max: 200 })
        .withMessage('Address must not exceed 200 characters!'),

    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number!'),

    body('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid HTTP/HTTPS URL!')
        .isLength({ max: 500 })
        .withMessage('Avatar URL must not exceed 500 characters!')
]

module.exports = { loginValidation, registerValidation };

