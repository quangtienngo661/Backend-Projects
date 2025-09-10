const catchAsync = require("../utils/catchAsync.util");
const userService = require("../services/user.service")

const userRegister = catchAsync(async (req, res, next) => {
    const newUser = await userService.userRegister(req, res, next);
    return res.ok(newUser, 201);
});

const userLogin = catchAsync(async (req, res, next) => {
    const token = await userService.userLogin(req, res, next);
    return res.ok({ token }, 200);
});

const updateUserProfile = catchAsync(async (req, res, next) => {
    const updatedProfile = await userService.updateUserProfile(req, res, next);
    return res.ok(updatedProfile, 200)
})

const removeUser = catchAsync(async (req, res, next) => {
    const removedUser = await userService.removeUser(req, res, next);
    return res.ok(removedUser, 200)
})

const getAllUser = async (req, res, next) => {
    const users = await userService.getAllUser(req, res, next);
    return res.ok(users, 200);
}

module.exports = { userRegister, userLogin, updateUserProfile, removeUser, getAllUser }