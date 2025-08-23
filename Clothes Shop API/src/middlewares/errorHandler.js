const { failure } = require("../utils/responseHelper")

const errorHandler = (err, req, res, next) => {
    // Provide default status code if not set
    const status = err.statusCode || 500;

    // Log error for debugging (optional)
    // if (process.env.NODE_ENV !== 'production') {
    //     console.error('Error caught by global handler:', err);
    // }

    return failure(res, err, status);
}

module.exports = errorHandler;