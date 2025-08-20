const userService = require('../../services/user.service');
const catchAsync = require('../../utils/asyncWrapper');

const userRegister = catchAsync(async (req, res, next) => {
  const newUser = await userService.userRegister(req, res, next);
  return res.ok(newUser, 201);
});

const userLogin = catchAsync(async (req, res, next) => {
  const token = await userService.userLogin(req, res, next);
  return res.ok(token);
});

const getEnrolledCourses = catchAsync(async (req, res, next) => {
  const { enrollments } = await userService.getEnrolledCourses(req, res, next);
  return res.ok(enrollments);
});

module.exports = { userRegister, userLogin, getEnrolledCourses };
