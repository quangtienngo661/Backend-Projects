const { body } = require('express-validator');

const User = require('../models/User');
const AppError = require('../utils/appError');

const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username musst be between 3 and 30 characters')
    .custom(async (username) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new AppError('Username already exists', 409);
      }
      return true;
    }),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('Email already exists', 409);
      }
      return true;
    }),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppdercase, lowercase, and number'),

  body('role').optional().isIn(['student', 'instructor', 'admin']).withMessage('Invalid role'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };
