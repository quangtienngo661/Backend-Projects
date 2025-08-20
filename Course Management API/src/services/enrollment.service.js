const Enrollment = require('../models/Enrollment');
const AppError = require('../utils/appError');

exports.enrollCourse = async (req, _res, _next) => {
  const studentId = req.user.id;
  const { courseId } = req.body;

  const isStudentEnrolled = await Enrollment.findOne({
    studentId,
    courseId,
  });

  if (isStudentEnrolled) {
    throw new AppError('You have enrolled this course before', 409);
  }

  const studentEnrolled = await Enrollment.create({
    studentId,
    courseId,
  });

  const populatedEnrollment = await Enrollment.findById(studentEnrolled._id)
    .populate('courseId')
    .populate('studentId', '-password');

  return populatedEnrollment;
};
