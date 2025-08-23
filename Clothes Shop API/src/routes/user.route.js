const express = require('express');
const router = express.Router();
const { userRegister, userLogin } = require("../controllers/user.controller");
const { loginLimiter } = require('../configs/rateLimit');

router.post('/login', loginLimiter, userLogin);
router.post('/register', userRegister);

module.exports = router;