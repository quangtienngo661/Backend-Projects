const catchAsync = require("../utils/catchAsync.util");
const userService = require("../services/user.service")

const userRegister = catchAsync(async (req, res, next) => {
    const newUser = await userService.userRegister(req, res, next);
    return res.ok(newUser, 201);
});

const userLogin = catchAsync(async (req, res, next) => {
    const token = await userService.userLogin(req, res, next);
    return res.ok({ token }, 200);
})

module.exports = { userRegister, userLogin }