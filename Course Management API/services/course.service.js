const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Review = require("../models/Review");
const AppError = require("../utils/appError");


exports.getAllCourses = async (req, res, next) => {
    return await Course.find();
}

exports.getOneCourse = async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
        throw new AppError('Course not found', 404);
    }
    return course;
}

exports.createCourse = async (req, res, next) => {
    const courseInfo = { ...req.body }
    const createdCourse = await Course.create({
        ...courseInfo,
        createdBy: req.user.id
    })
    const populatedCourse = await Course.findById(createdCourse._id)
        .populate('createdBy', '-password');
    if (!populatedCourse) {
        throw new AppError('Course not found', 404);
    }
    return populatedCourse;
}

exports.updateOneCourse = async (req, res, next) => {
    const { id } = req.params
    const courseInfo = { ...req.body };

    const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { ...courseInfo },
        {
            new: true,           // Return the updated document
            runValidators: true  // Run schema validators
        }
    ).populate('createdBy');

    if (!updatedCourse) {
        throw new AppError("Course not found", 404);
    }

    return updatedCourse;

}

exports.deleteOneCourse = async (req, res, next) => {
    const { id } = req.params

    const deletedCourse = await Course.findByIdAndDelete(id).populate('createdBy');

    if (!deletedCourse) {
        throw new AppError("Course not found", 404);
    }

    return deletedCourse;
}

exports.getCourseLesson = async (req, res, next) => {
    try {
        const [lessons, countLessons] = await Promise.all([
            Lesson.find({ courseId: req.params.id }),
            Lesson.countDocuments({ courseId: req.params.id })
        ])

        console.log("get courses' lessons service")
        return { lessons, countLessons }
    } catch (error) {
        throw new AppError(error.message || "Error fetching enrolled courses", 500);
    }

}

exports.createLesson = async (req, res, next) => {
    const lessonInfo = { ...req.body }; // TODO: lesson info validation

    const courseId = req.params.id;

    const newLesson = await Lesson.create({
        ...lessonInfo,
        courseId
    })

    if (!newLesson) {
        throw new AppError("Error creating mew lesson", 500)
    }

    const populatedLesson = await Lesson.findById(newLesson._id).populate('courseId');

    return populatedLesson;
}

exports.getCourseReviews = async (req, res, next) => {
    const courseId = req.params.id;
    const [reviews, countReviews] = await Promise.all([
        Review.find({ courseId }),
        Review.countDocuments({ courseId }),
    ]);
    return { reviews, countReviews };
}


exports.postReview = async (req, res, next) => {
    const studentId = req.user.id;
    const courseId = req.params.id;
    const reviewInfo = { ...req.body };
    console.log(reviewInfo)

    const newReview = await Review.create({
        courseId,
        userId: studentId,
        ...reviewInfo
    })

    const populatedReview = await Review.findById(newReview._id);
    return populatedReview;
}