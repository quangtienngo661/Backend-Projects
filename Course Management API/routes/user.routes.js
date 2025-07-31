const express = require('express');
const router = express.Router();
const { userRegister, userLogin, getEnrolledCourses } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { restrictToRole } = require('../middlewares/role.middleware');
const { registerValidation, loginValidation } = require('../validations/auth.validation');
const { validateRequest } = require('../middlewares/validation.middleware');

router.post('/auth/register', registerValidation, validateRequest, userRegister);
router.post('/auth/login', loginValidation, validateRequest, userLogin);
router.get('/enrollments', authMiddleware, restrictToRole('student'), getEnrolledCourses)

module.exports = router