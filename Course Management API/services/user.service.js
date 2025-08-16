const bcrypt = require('bcryptjs');

const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const AppError = require('../utils/appError');
const hashPassword = require('../utils/hashPassword');
const jwtSign = require('../utils/jwtSign');

exports.userRegister = async (req, _res, _next) => {
  const userInfo = { ...req.body };
  console.log(userInfo);
  const existingUser = await User.findOne({ email: userInfo.email });
  if (existingUser) {
    throw new AppError('This email has existed', 409);
  }

  const hashedPassword = hashPassword(userInfo.password);
  if (!hashedPassword) {
    throw new AppError('Error hashing password', 500);
  }

  const createdUser = await User.create({
    ...userInfo,
    password: hashedPassword,
  });

  const newUser = await User.findById(createdUser._id).select('-password');
  if (!newUser) {
    throw new AppError('New created user not found', 404);
  }

  return newUser;
};

exports.userLogin = async (req, _res, _next) => {
  const userInfo = { ...req.body };
  const user = await User.findOne({ email: userInfo.email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 404);
  }

  const isValidPassword = await bcrypt.compareSync(userInfo.password, user.password);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = await jwtSign(user._id);
  if (!token) {
    throw new AppError('Error generating sign in tokens', 500);
  }

  return token;
};

exports.getEnrolledCourses = async (req, _res, _next) => {
  try {
    const [enrollments, countEnrollments] = await Promise.all([
      Enrollment.find({ studentId: req.user.id })
        .populate('courseId')
        .populate('studentId', '-password'),
      Enrollment.countDocuments({ studentId: req.user.id }),
    ]);

    return { enrollments, countEnrollments };
  } catch (error) {
    throw new AppError(error.message || 'Error fetching enrolled courses', 500);
  }
};
