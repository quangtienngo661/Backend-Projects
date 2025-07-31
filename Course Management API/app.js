const express = require('express');
const globalErrorHandler = require('./middlewares/globalErrorHandler.middleware');
const app = express();
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoute = require('./routes/enrollment.routes');
const authMiddleware = require('./middlewares/auth.middleware')
const connectDB = require('./configs/db');
const { restrictToRole } = require('./middlewares/role.middleware');
const { validateRequest } = require('./middlewares/validation.middleware');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User Authentication
app.use('/api/users', userRoutes);

// Course API
app.use('/api/courses', authMiddleware, courseRoutes)

// Enrollment API
app.use('/api/enrollments', authMiddleware, restrictToRole('student'), enrollmentRoute)

// Error handler
app.use(globalErrorHandler);

module.exports = app;
