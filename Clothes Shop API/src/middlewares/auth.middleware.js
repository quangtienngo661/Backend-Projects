const jwt = require('jsonwebtoken');
require('dotenv').config();

const AppError = require("../utils/AppError.util");
const catchAsync = require("../utils/catchAsync.util");

const JWT_SECRET = process.env.JWT_SECRET;

const auth = catchAsync((req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith("Bearer ")) {
        throw new AppError("Authentication required", 401);
    }

    const token = bearer.split(' ')[1];
    if (!token) {
        throw new AppError("Authentication required", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    next();
})

module.exports = auth;