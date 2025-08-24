class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        // captureStackTrace: make the error stack cleaner, only display where the actual error comes from
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;