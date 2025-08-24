const rateLimit = require("express-rate-limit");
const { failure } = require("../utils/responseHelper.util");

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    handler: (req, res, next) => {
        return failure(res, {
            message: "Too many requests from this IP, please try again later.",
            code: 429
        }, 429)
    }, 
    standardHeaders: true, 
    legacyHeaders: false
})

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 10, 
    handler: (req, res, next) => {
        return failure(res, {
            message: "Too many requests from this IP, please try again later.",
            code: 429
        }, 429)
    }, 
    standardHeaders: true, 
    legacyHeaders: false
})


module.exports = { globalLimiter, loginLimiter };