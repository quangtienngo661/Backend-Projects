const AppError = require("../utils/AppError");

const whiteList = ['http://localhost:3000', 'http://127.0.0.1:5500'];

const corsConfig = {
    origin: function(origin, callback) {
        if (!origin || whiteList.includes(origin)) return callback(null, true);
        throw new AppError("Not allowed by CORS", 403)
    }, 
    credentials: true
}

module.exports = corsConfig;