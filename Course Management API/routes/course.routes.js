const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getOneCourse,
  createCourse,
  updateOneCourse,
  deleteOneCourse,

  getCourseLesson,
  createLesson,
  updateLesson,
  deleteLesson,

  getCourseReviews,
  postReview,
  updateReview,
  deleteReview,
} = require('../controllers/course.controller');
const {
  restrictToRole,
  checkCourseOwnership,
  checkReviewOwnership,
} = require('../middlewares/role.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const {
  createCourseValidation,
  updateCourseValidation,
  createLessonValidation,
  updateLessonValidation,
  createReviewValidation,
  updateReviewValidation,
} = require('../validations/course.validation');

// TODO: Finish deleteReview, deleteLesson validation later

// Course routes
router.get('/', getAllCourses);
router.get('/:courseId', getOneCourse);
router.post(
  '/',
  restrictToRole('instructor'),
  createCourseValidation,
  validateRequest,
  createCourse
);
router.patch(
  '/:courseId',
  restrictToRole('instructor'),
  updateCourseValidation,
  validateRequest,
  checkCourseOwnership,
  updateOneCourse
);
router.delete('/:courseId', restrictToRole('instructor'), checkCourseOwnership, deleteOneCourse);

// Lesson routes
router.get('/:courseId/lessons', getCourseLesson);
router.post(
  '/:courseId/lessons',
  restrictToRole('instructor'),
  createLessonValidation,
  validateRequest,
  checkCourseOwnership,
  createLesson
);
router.patch(
  '/:courseId/lessons/:lessonId',
  restrictToRole('instructor'),
  updateLessonValidation,
  validateRequest,
  checkCourseOwnership,
  updateLesson
);
router.delete(
  '/:courseId/lessons/:lessonId',
  restrictToRole('instructor'),
  checkCourseOwnership,
  deleteLesson
);

// Review routes
router.get('/:courseId/reviews', getCourseReviews);
router.post(
  '/:courseId/reviews',
  restrictToRole('student'),
  createReviewValidation,
  validateRequest,
  postReview
);
router.patch(
  '/:courseId/reviews/:reviewId',
  restrictToRole('student'),
  updateReviewValidation,
  validateRequest,
  checkReviewOwnership,
  updateReview
);
router.delete(
  '/:courseId/reviews/:reviewId',
  restrictToRole('student'),
  checkReviewOwnership,
  deleteReview
);

module.exports = router;
