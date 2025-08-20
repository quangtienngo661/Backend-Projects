const enrollmentService = require('../services/enrollment.service');
const catchAsync = require('../utils/asyncWrapper');

const enrollCourse = catchAsync(async (req, res, next) => {
  const studentEnrolled = await enrollmentService.enrollCourse(req, res, next);
  return res.ok(studentEnrolled, 201);
});

module.exports = { enrollCourse };
