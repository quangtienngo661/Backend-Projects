require('dotenv').config();

const AppError = require("../utils/AppError.util");
const catchAsync = require("../utils/catchAsync.util"); // The issue is that catchAsync expects a function that returns a Promise, but you're returning a function that returns another function.

const restrictToRole = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                throw new AppError("Authentication required", 401);
            }

            if (!roles.includes(req.user.role)) {
                throw new AppError("You have no permission to access this feature", 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { restrictToRole };