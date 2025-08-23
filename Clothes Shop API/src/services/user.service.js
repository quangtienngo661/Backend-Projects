const User = require('../models/User');
const AppError = require('../utils/AppError');
const hashPassword = require('../utils/hashPassword');
const bcrypt = require('bcryptjs');
const jwtSign = require('../utils/jwtSign');

exports.userRegister = async (req, res, next) => {
    const userInfo = { ...req.body };

    console.log(userInfo)
    if (!userInfo || !userInfo.email || !userInfo.name || !userInfo.password) {
        throw new AppError("Missing required fields", 400)
    }
    
    const existingUser = await User.findOne({ email: userInfo.email });
    if (existingUser) {
        throw new AppError("This email is already in use. Please use a different email address.", 409)
    }

    const hashedPassword = hashPassword(userInfo.password);

    const newUser = await User.create({
        ...userInfo, 
        password: hashedPassword
    });

    return newUser;
}

exports.userLogin = async (req, res, next) => {
    const userInfo = { ...req.body };

    if (!userInfo || !userInfo.email || !userInfo.password) {
        throw new AppError("Missing required fields", 400)
    }

    const user = await User.findOne({ email: userInfo.email }).select('+password');
    if (!user) {
        throw new AppError("Email or password is incorrect", 401)
    }

    const isValidPassword = bcrypt.compareSync(userInfo.password, user.password);
    if (!isValidPassword) {
        throw new AppError("Email or password is incorrect", 401)
    }

    const accessToken =  await jwtSign(user._id, user.role);
    if (!accessToken) {
        throw new AppError("Error generating access token", 500)
    }

    return accessToken;
}