const express = require('express');
const router = express.Router();
const { userRegister, userLogin } = require("../controllers/user.controller");
const { loginLimiter } = require('../configs/rateLimit.config');
const { loginValidation, registerValidation } = require('../validation/user.validation');
const validateRequest = require('../middlewares/validator.middleware');

router.post('/login', loginLimiter, loginValidation, validateRequest, userLogin);
router.post('/register', registerValidation, validateRequest ,userRegister);

module.exports = router;