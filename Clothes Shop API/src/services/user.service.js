const User = require('../models/User.model');
const AppError = require('../utils/AppError.util');
const hashPassword = require('../utils/hashPassword.util');
const bcrypt = require('bcryptjs');
const jwtSign = require('../utils/jwtSign.util');
const Cart = require('../models/Cart.model');
const { default: mongoose } = require('mongoose');


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

    if (userInfo.role !== 'admin') {
        await Cart.create({
            user: newUser._id,
            items: []
        })
    }

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

    const accessToken = await jwtSign(user._id, user.role);
    if (!accessToken) {
        throw new AppError("Error generating access token", 500)
    }

    return accessToken;
}

exports.updateUserProfile = async (req, res, next) => {
    const userInfo = { ...req.body }

    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("User ID is not a MongoID format", 400)
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError("User not found!", 404);
    }

    if (req.user.role === 'user' && user._id.toString() === req.user.id) {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            userInfo,
            {
                new: true,
                runValidators: true
            }
        )

        return updatedUser;
    } else if (req.user.role === 'admin') {
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            userInfo,
            {
                new: true,
                runValidators: true
            }
        )

        return updatedUser;
    } else {
        throw new AppError("Unauthorized to update this user", 403);
    }
}

exports.removeUser = async (req, res, next) => {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("User ID is not a MongoID format", 400)
    }
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError("User not found!", 404);
    }

    if (req.user.role === 'user' && user._id.toString() === req.user.id) {
        const removedUser = await User.findByIdAndDelete(req.user.id)
        return removedUser;
    } else if (req.user.role === 'admin') {
        const removedUser = await User.findByIdAndDelete(user._id)
        return removedUser;
    } else {
        throw new AppError("Unauthorized to delete this user", 403);
    }
}

exports.getAllUser = async (req, res, next) => {
    // Paginition
    const limit = 20;
    const page = Math.max(1, req.query.page || 1);
    const skip = (page - 1) * limit;

    // Sorting
    const allowedSortFields = ['name', 'email', 'role']
    const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'name';
    const direction = req.query.dir === 'desc' ? -1 : 1;

    const users = await User.find()
        .skip(skip)
        .limit(limit)
        .sort({[sortBy]: direction});

    return users
}

// TODO: Forget password, change password, refresh token, otp verification