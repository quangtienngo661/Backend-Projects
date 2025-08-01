const Course = require("../models/Course");
const Review = require("../models/Review");
const User = require("../models/User");
const AppError = require("../utils/appError");

const restrictToRole = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return next(new AppError("User not found", 404));
            }

            if (!roles.includes(user.role)) {
                return next(new AppError("You are not allowed to perform this action!", 403));
            }

            next();
        } catch (error) {
            if (error instanceof AppError) {
                return next(error);
            } else {
                return next(new AppError(error.message || "Error checking user permissions", 500));
            }
        }
    }
}

const checkCourseOwnership = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        if (req.user.id !== course.createdBy.toString() && req.user.role !== "admin") {
            return next(new AppError("You have no permission to modify this course", 403));
        }

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        } else {
            return next(new AppError(error.message || "Error checking course ownership", 500));
        }
    }
}

const checkReviewOwnership = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return next(new AppError("Review not found", 404));
        }

        if (req.user.id !== review.userId.toString() && req.user.role !== "admin") {
            return next(new AppError("You have no permission to modify this review", 403));
        }

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        } else {
            return next(new AppError(error.message || "Error checking review ownership", 500));
        }
    }
}


module.exports = { restrictToRole, checkCourseOwnership, checkReviewOwnership }