const AppError = require("../utils/AppError.util");
const catchAsync = require("../utils/catchAsync.util");

const routeNotFoundException = catchAsync((req, res, next) => {
    throw new AppError("Route not found", 404)
})

module.exports = routeNotFoundException;