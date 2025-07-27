const express = require('express');
const router = express.Router();
const {
    getAllCourses, 
    getOneCourse, 
    createCourse, 
    updateOneCourse, 
    deleteOneCourse, 
    getCourseLesson, 
    createLesson, 
    getCourseReviews, 
    postReview
} = require('../controllers/course.controller');
const { restrictToRole, checkCourseOwnership } = require('../middlewares/role.middleware');

router.get('/', getAllCourses)
router.get('/:id', getOneCourse)
router.get('/:id/lessons', getCourseLesson)
router.post('/:id/lessons', restrictToRole('instructor'), checkCourseOwnership, createLesson)
router.get('/:id/reviews', getCourseReviews)
router.post('/:id/reviews', restrictToRole('student'), postReview)
router.post('/', restrictToRole('instructor'), createCourse)
router.patch('/:id', restrictToRole('instructor'), checkCourseOwnership, updateOneCourse)
router.delete('/:id', restrictToRole('instructor'), checkCourseOwnership, deleteOneCourse)

module.exports = router;