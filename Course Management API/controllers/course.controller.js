const courseService = require('../services/course.service');

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses(req, res, next);
    return res.ok(courses)
  } catch (error) {
    return res.fail(error)
  }
};

const getOneCourse = async (req, res, next) => {
  try {
    const course = await courseService.getOneCourse(req, res, next);
    return res.ok(course)
  } catch (error) {
    res.fail(error)
  }
};

const createCourse = async (req, res, next) => {
  try {
    const createdCourse = await courseService.createCourse(req, res, next);
    return res.ok(createdCourse, 201)
  } catch (error) {
    res.fail(error)
  }
};

const updateOneCourse = async (req, res, next) => {
  try {
    const updatedCourse = await courseService.updateOneCourse(req, res, next);
    return res.ok(updatedCourse)
  } catch (error) {
    res.fail(error)

  }
};

const deleteOneCourse = async (req, res, next) => {
  try {
    const deletedCourse = await courseService.deleteOneCourse(req, res, next);
    return res.ok(deletedCourse)
  } catch (error) {
    res.fail(error)
  }
};

const getCourseLesson = async (req, res, next) => {
  try {
    const { lessons } = await courseService.getCourseLesson(req, res, next);
    return res.ok(lessons)
  } catch (error) {
    res.fail(error)
  }
};

const createLesson = async (req, res, next) => {
  try {
    const newLesson = await courseService.createLesson(req, res, next);
    return res.ok(newLesson, 201)
  } catch (error) {
    res.fail(error)
  }
};

const getCourseReviews = async (req, res, next) => {
  try {
    const { reviews } = await courseService.getCourseReviews(req, res, next);
    return res.ok(reviews)
  } catch (error) {
    res.fail(error)
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const updatedLesson = await courseService.updateLesson(req, res, next);
    return res.ok(updatedLesson)
  } catch (error) {
    res.fail(error)
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const deletedLesson = await courseService.deleteLesson(req, res, next);
    return res.ok(deletedLesson)
  } catch (error) {
    res.fail(error)
  }
};

const postReview = async (req, res, next) => {
  try {
    const newReview = await courseService.postReview(req, res, next);
    return res.ok(newReview)
  } catch (error) {
    res.fail(error)
  }
};

const updateReview = async (req, res, next) => {
  try {
    const updatedReview = await courseService.updateReview(req, res, next);
    return res.ok(updatedReview)
  } catch (error) {
    res.fail(error)
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const deletedReview = await courseService.deleteReview(req, res, next);
    return res.ok(deletedReview)
  } catch (error) {
    res.fail(error)
  }
};

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
