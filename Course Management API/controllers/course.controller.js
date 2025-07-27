const courseService = require('../services/course.service');
const AppError = require('../utils/appError');

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await courseService.getAllCourses(req, res, next);
        return res.status(200).json({
            status: 'success',
            data: courses
        });
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

const getOneCourse = async (req, res, next) => {
    try {
        const course = await courseService.getOneCourse(req, res, next);
        return res.status(200).json({
            status: 'success',
            data: course
        });
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

const createCourse = async (req, res, next) => {
    try {
        const createdCourse = await courseService.createCourse(req, res, next);
        return res.status(201).json({
            msg: "Course created successfully",
            createdCourse
        });

    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

const updateOneCourse = async (req, res, next) => {
    try {
        const updatedCourse = await courseService.updateOneCourse(req, res, next);
        return res.status(200).json({
            msg: "Updated successfully",
            updatedCourse: {
                title: updatedCourse.title,
                description: updatedCourse.description,
                price: updatedCourse.price,
                createdBy: updatedCourse.createdBy.username || ""
            }
        })
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

const deleteOneCourse = async (req, res, next) => {
    try {
        const deletedCourse = await courseService.deleteOneCourse(req, res, next);
        return res.status(200).json({
            msg: "Course deleted successfully",
            deletedCourse: {
                title: deletedCourse.title,
                description: deletedCourse.description,
                price: deletedCourse.price,
                createdBy: deletedCourse.createdBy.username || ""
            }
        })
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

const getCourseLesson = async (req, res, next) => {
    try {
        console.log("get courses' lessons")

        const { lessons, countLessons } = await courseService.getCourseLesson(req, res, next);

        return res.status(200).json({
            msg: `This course has totally ${countLessons} ${countLessons === 1 ? 'lesson' : 'lessons'}`,
            lessons
        })
    } catch (error) {

    }
}

const createLesson = async (req, res, next) => {
    try {
        const newLesson = await courseService.createLesson(req, res, next);
        return res.status(201).json({
            msg: "New lesson for this course is created successfully",
            newLesson
        })
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

const getCourseReviews = async (req, res, next) => {
    try {
        const { reviews, countReviews } = await courseService.getCourseReviews(req, res, next);
        return res.status(200).json({
            msg: `This course has totally ${countReviews} ${countReviews === 1 ? 'review' : 'reviews'}`,
            reviews
        })
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}


const postReview = async (req, res, next) => {
    try {
        const newReview = await courseService.postReview(req, res, next);
        return res.status(201).json({
            msg: "New review for this course created successfully",
            newReview
        })
    } catch (error) {
        if (error instanceof AppError) {
            return next(error)
        } else {
            return next(new AppError(error.message, 500))
        }
    }
}

module.exports = {
    getAllCourses,
    getOneCourse,
    createCourse,
    updateOneCourse,
    deleteOneCourse,
    getCourseLesson,
    createLesson,
    getCourseReviews,
    postReview
} 