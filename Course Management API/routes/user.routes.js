const express = require('express');
const router = express.Router();
const { userRegister, userLogin, getEnrolledCourses } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { restrictToRole } = require('../middlewares/role.middleware');

router.post('/auth/register', userRegister);
router.post('/auth/login', userLogin);
router.get('/enrollments', authMiddleware, restrictToRole('student'), getEnrolledCourses)

module.exports = router