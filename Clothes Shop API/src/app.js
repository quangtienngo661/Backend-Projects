// Built-in dependencies/middlewares
const express = require('express');
const cors = require('cors')
const helmet = require('helmet');

// Self-built middlewares
const errorHandler = require('./middlewares/errorHandler.middleware');
const { restrictToRole } = require('./middlewares/role.middleware');

// Configs
const connectDB = require('./configs/db.config');
const corsConfig = require('./configs/cors.config');

// Utils
const { success } = require('./utils/responseHelper.util');
const { globalLimiter } = require('./configs/rateLimit.config');

// Imported routes
const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const catchAsync = require('./utils/catchAsync.util');
const routeNotFoundException = require('./middlewares/routeNotFound.middleware');

const app = express();
connectDB();

// Using middlewares
app.use(globalLimiter)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsConfig));

// Response helper
app.use((req, res, next) => {
    res.ok = (data, status, meta) => success(res, data, status, meta);
    next();
});

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);

// Middleware for catching unexisted routes
// For more specifically, if there is an unmatched route ascendingly, this middleware will run 
app.use(routeNotFoundException);

// Error handler
app.use(errorHandler);

module.exports = app;

