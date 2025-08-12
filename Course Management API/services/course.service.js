const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Review = require('../models/Review');
const AppError = require('../utils/appError');

exports.getAllCourses = async (_req, _res, _next) => {
  return await Course.find();
};

exports.getOneCourse = async (req, _res, _next) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }
  return course;
};

exports.createCourse = async (req, _res, _next) => {
  const courseInfo = { ...req.body };
  const createdCourse = await Course.create({
    ...courseInfo,
    createdBy: req.user.id,
  });
  const populatedCourse = await Course.findById(createdCourse._id).populate(
    'createdBy',
    '-password'
  );
  if (!populatedCourse) {
    throw new AppError('Course not found', 404);
  }
  return populatedCourse;
};

exports.updateOneCourse = async (req, _res, _next) => {
  const { courseId } = req.params;
  const courseInfo = { ...req.body };

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { ...courseInfo },
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    }
  ).populate('createdBy');

  if (!updatedCourse) {
    throw new AppError('Course not found', 404);
  }

  return updatedCourse;
};

exports.deleteOneCourse = async (req, _res, _next) => {
  const { courseId } = req.params;

  const deletedCourse = await Course.findByIdAndDelete(courseId).populate('createdBy');

  if (!deletedCourse) {
    throw new AppError('Course not found', 404);
  }

  return deletedCourse;
};

exports.getCourseLesson = async (req, _res, _next) => {
  try {
    const [lessons, countLessons] = await Promise.all([
      Lesson.find({ courseId: req.params.courseId }),
      Lesson.countDocuments({ courseId: req.params.courseId }),
    ]);

    console.log("get courses' lessons service");
    return { lessons, countLessons };
  } catch (error) {
    throw new AppError(error.message || 'Error fetching enrolled courses', 500);
  }
};

exports.createLesson = async (req, _res, _next) => {
  const lessonInfo = { ...req.body }; // TODO: lesson info validation

  const courseId = req.params.courseId;

  const newLesson = await Lesson.create({
    ...lessonInfo,
    courseId,
  });

  if (!newLesson) {
    throw new AppError('Error creating mew lesson', 500);
  }

  const populatedLesson = await Lesson.findById(newLesson._id).populate('courseId');

  return populatedLesson;
};

exports.updateLesson = async (req, _res, _next) => {
  const lessonInfo = { ...req.body };
  const updatedLesson = await Lesson.findByIdAndUpdate(
    req.params.lessonId,
    { ...lessonInfo },
    { new: true, runValidators: true }
  );

  if (!updatedLesson) {
    throw new AppError('Lesson not found', 404);
  }

  return updatedLesson;
};

exports.deleteLesson = async (req, _res, _next) => {
  const deletedLesson = await Lesson.findByIdAndDelete(req.params.lessonId);
  if (!deletedLesson) {
    throw new AppError('Lesson not found', 404);
  }

  return deletedLesson;
};

exports.getCourseReviews = async (req, _res, _next) => {
  const courseId = req.params.courseId;
  const [reviews, countReviews] = await Promise.all([
    Review.find({ courseId }),
    Review.countDocuments({ courseId }),
  ]);
  return { reviews, countReviews };
};

exports.postReview = async (req, _res, _next) => {
  const studentId = req.user.id;
  const courseId = req.params.courseId;
  const reviewInfo = { ...req.body };
  console.log(reviewInfo);

  const newReview = await Review.create({
    courseId,
    userId: studentId,
    ...reviewInfo,
  });

  const populatedReview = await Review.findById(newReview._id);
  return populatedReview;
};

exports.updateReview = async (req, _res, _next) => {
  const reviewInfo = { ...req.body };
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.reviewId,
    { ...reviewInfo },
    { new: true, runValidators: true }
  );

  if (!updatedReview) {
    throw new AppError('Review not found', 404);
  }

  return updatedReview;
};

exports.deleteReview = async (req, _res, _next) => {
  const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);
  if (!deletedReview) {
    throw new AppError('Review not found', 404);
  }

  return deletedReview;
};
