const express = require('express');
const router = express.Router();
const { userRegister, userLogin, updateUserProfile, removeUser, getAllUser } = require("../controllers/user.controller");
const { loginLimiter } = require('../configs/rateLimit.config');
const { loginValidation, registerValidation } = require('../validations/user.validation');
const validateRequest = require('../middlewares/validator.middleware');
const auth = require('../middlewares/auth.middleware');
const { restrictToRole } = require('../middlewares/role.middleware');

router.get('/', auth, restrictToRole('admin'), getAllUser);
router.post('/auth/login', loginLimiter, loginValidation, validateRequest, userLogin);
router.post('/auth/register', registerValidation, validateRequest ,userRegister);
router.patch('/:userId', auth, updateUserProfile);
router.delete('/:userId', auth, removeUser);

module.exports = router;