const enrollmentService = require("../services/enrollment.service");
const AppError = require("../utils/appError");

const enrollCourse = async (req, res, next) => {
    try {
        const studentEnrolled = await enrollmentService.enrollCourse(req, res, next);
        return res.status(201).json({
            msg: "You enrolled this course successfully",
            studentEnrolled
        })
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        } else {
            return next(new AppError(error.message, 500));
        }
    }
}

module.exports =  { enrollCourse };