const { body, param } = require('express-validator');

const createCourseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),

  body('description')
    .trim()
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 1000 })
    .withMessage('Description must not be more than 1000 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a valid number')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('createdBy').not().exists().withMessage('CreatedBy field is not allowed in request body'),
];

const updateCourseValidation = [
  param('courseId').isMongoId().withMessage('Invalid course ID format'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),

  body('description')
    .trim()
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 1000 })
    .withMessage('Description must not be more than 1000 characters'),

  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a valid number')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('createdBy').not().exists().withMessage('CreatedBy field is not allowed in request body'),
];

const createLessonValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage("Lesson's title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Lessons's title must be between 5 and 200 characters"),

  body('content')
    .optional()
    .trim()
    .isString()
    .withMessage('Content must be a string')
    .isLength({ max: 5000 })
    .withMessage("Lessons's content must be lower or equal to 5000 characters"),

  param('courseId').isMongoId().withMessage('Invalid course ID format'),
];

const updateLessonValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage("Lesson's title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Lessons's title must be between 5 and 200 characters"),

  body('content')
    .optional()
    .trim()
    .isString()
    .withMessage('Content must be a string')
    .isLength({ max: 5000 })
    .withMessage("Lessons's content must be lower or equal to 5000 characters"),

  param('courseId').isMongoId().withMessage('Invalid course ID format'),

  param('lessonId').isMongoId().withMessage('Invalid lesson ID format'),
];

const createReviewValidation = [
  param('courseId').isMongoId().withMessage('Invalid course ID format'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('comment')
    .optional()
    .trim()
    .isString()
    .withMessage('Comment must be a string')
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters'),
];

const updateReviewValidation = [
  param('courseId').isMongoId().withMessage('Invalid course ID format'),

  param('reviewId').isMongoId().withMessage('Invalid review ID format'),

  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  body('comment')
    .optional()
    .trim()
    .isString()
    .withMessage('Comment must be a string')
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters'),
];

module.exports = {
  createCourseValidation,
  updateCourseValidation,
  createLessonValidation,
  updateLessonValidation,
  createReviewValidation,
  updateReviewValidation,
};
