const AppError = require("../utils/appError");

const whitelist = ['https://exampleurl.com'];

const corsConfig = {
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) return callback(null, true);
        callback(new AppError("Not allowed by CORS", 403))
    }, 
    credentials: true
}

module.exports = corsConfig;