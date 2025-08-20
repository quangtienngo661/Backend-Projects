const courseService = require('../services/course.service');
const catchAsync = require('../utils/asyncWrapper');

const getAllCourses = catchAsync(async (req, res, next) => {
  const courses = await courseService.getAllCourses(req, res, next);
  return res.ok(courses);
});

const getOneCourse = catchAsync(async (req, res, next) => {
  const course = await courseService.getOneCourse(req, res, next);
  return res.ok(course);
});

const createCourse = catchAsync(async (req, res, next) => {
  const createdCourse = await courseService.createCourse(req, res, next);
  return res.ok(createdCourse, 201);
});

const updateOneCourse = catchAsync(async (req, res, next) => {
  const updatedCourse = await courseService.updateOneCourse(req, res, next);
  return res.ok(updatedCourse);
});

const deleteOneCourse = catchAsync(async (req, res, next) => {
  const deletedCourse = await courseService.deleteOneCourse(req, res, next);
  return res.ok(deletedCourse);
});

const getCourseLesson = catchAsync(async (req, res, next) => {
  const { lessons } = await courseService.getCourseLesson(req, res, next);
  return res.ok(lessons);
});

const createLesson = catchAsync(async (req, res, next) => {
  const newLesson = await courseService.createLesson(req, res, next);
  return res.ok(newLesson, 201);
});

const updateLesson = catchAsync(async (req, res, next) => {
  const updatedLesson = await courseService.updateLesson(req, res, next);
  return res.ok(updatedLesson);
});

const deleteLesson = catchAsync(async (req, res, next) => {
  const deletedLesson = await courseService.deleteLesson(req, res, next);
  return res.ok(deletedLesson);
});

const getCourseReviews = catchAsync(async (req, res, next) => {
  const { reviews } = await courseService.getCourseReviews(req, res, next);
  return res.ok(reviews);
});

const postReview = catchAsync(async (req, res, next) => {
  const newReview = await courseService.postReview(req, res, next);
  return res.ok(newReview, 201);
});

const updateReview = catchAsync(async (req, res, next) => {
  const updatedReview = await courseService.updateReview(req, res, next);
  return res.ok(updatedReview);
});

const deleteReview = catchAsync(async (req, res, next) => {
  const deletedReview = await courseService.deleteReview(req, res, next);
  return res.ok(deletedReview);
});

module.exports = {
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
};
