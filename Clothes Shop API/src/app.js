const express = require('express');
const cors = require('cors')

const connectDB = require('./configs/db.config');
const { success } = require('./utils/responseHelper.util');
const userRoutes = require('./routes/user.route'); 
const errorHandler = require('./middlewares/errorHandler.middleware');
const auth = require('./middlewares/auth.middleware');
const { restrictToRole } = require('./middlewares/role.middleware');
const helmet = require('helmet');
const { globalLimiter } = require('./configs/rateLimit.config');
const corsConfig = require('./configs/cors.config');

const app = express();
connectDB();

// Middlewares
app.use(globalLimiter)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsConfig)); // TODO: cors configuration

// Response helper
app.use((req, res, next) => {
    res.ok = (data, status, meta) => success(res, data, status, meta);
    next();
});

// Routes
app.use('/user', userRoutes);
app.get('/', (req, res) => {
    return res.end("Only admin can access this route, and this route is authorized")
})

// Error handler
app.use(errorHandler);

module.exports = app;
