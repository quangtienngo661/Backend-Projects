const express = require('express');
const router = express.Router();
const { userRegister, userLogin } = require("../controllers/user.controller");
const { loginLimiter } = require('../configs/rateLimit.config');
const { loginValidation, registerValidation } = require('../validations/user.validation');
const validateRequest = require('../middlewares/validator.middleware');

router.post('/auth/login', loginLimiter, loginValidation, validateRequest, userLogin);
router.post('/auth/register', registerValidation, validateRequest ,userRegister);

module.exports = router;