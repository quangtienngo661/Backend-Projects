const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const corsConfig = require('./configs/cors');
const connectDB = require('./configs/db');
const authMiddleware = require('./middlewares/auth.middleware');
const globalErrorHandler = require('./middlewares/globalErrorHandler.middleware');
const app = express();
const { restrictToRole } = require('./middlewares/role.middleware');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoute = require('./routes/enrollment.routes');
const userRoutes = require('./routes/user.routes');
const limiter =  require('./utils/rateLimitCfg');
const { success } = require('./utils/response');

connectDB();

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsConfig)); 

app.use((req, res, next) => {
  res.ok = (data, status = 200, meta) => success(res, data, status, meta);
  next();
});

// / page
app.use('/', (req, res) => {
  return res.end('Course Management System');
});

// User Authentication
app.use('/api/users', userRoutes);

// Course API
app.use('/api/courses', authMiddleware, courseRoutes);

// Enrollment API
app.use('/api/enrollments', authMiddleware, restrictToRole('student'), enrollmentRoute);

// Error handler
app.use(globalErrorHandler);

module.exports = app;
