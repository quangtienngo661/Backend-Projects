const userService = require('../services/user.service');
const AppError = require('../utils/appError');

const userRegister = async (req, res, next) => {
  try {
    const newUser = await userService.userRegister(req, res, next);
    return res.ok(newUser)
  } catch (error) {
    res.fail(error)
  }
};

const userLogin = async (req, res, next) => {
  try {
    const token = await userService.userLogin(req, res, next);
    return res.ok(token)
  } catch (error) {
    res.fail(error)
  }
};

const getEnrolledCourses = async (req, res, next) => {
  try {
    const { enrollments, countEnrollments } = await userService.getEnrolledCourses(req, res, next);
    return res.ok(enrollments)
  } catch (error) {
    res.fail(error)
  }
};

module.exports = { userRegister, userLogin, getEnrolledCourses };
