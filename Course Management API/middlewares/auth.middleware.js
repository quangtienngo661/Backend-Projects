const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
require('dotenv').config();

const auth = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = bearer.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Unauthorized', 401));
  }
};

module.exports = auth;
