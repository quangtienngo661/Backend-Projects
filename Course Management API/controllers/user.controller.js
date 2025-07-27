const userService = require('../services/user.service');
const AppError = require('../utils/appError');

const userRegister = async (req, res, next) => {
    try {
        const newUser = await userService.userRegister(req, res, next)

        return res.status(201).json({
            msg: "New user's created successfully",
            newUser
        })

    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

const userLogin = async (req, res, next) => {
    try {
        const token = await userService.userLogin(req, res, next)

        return res.status(200).json({
            msg: "Login successfully",
            token
        })

    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

const getEnrolledCourses = async (req, res, next) => {
    try {
        const { enrollments, countEnrollments } = await userService.getEnrolledCourses(req, res, next);
        return res.status(200).json({
            msg: `This student has enrolled ${countEnrollments} ${countEnrollments === 1 ? 'course' : 'courses'}`,
            enrollments
        })
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

module.exports = { userRegister, userLogin, getEnrolledCourses }