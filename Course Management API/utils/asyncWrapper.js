const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next); // catch error: if an error is caught, globalErrorHandler will execute
    }
}

module.exports = catchAsync;