const jwt = require('jsonwebtoken');

const ENV = require('../configs/env');
const AppError = require('../utils/appError');

const auth = (req, _res, next) => {
  // Defensive checking cho req.headers
  // const headers = req.headers || {};
  const bearer = req.headers.authorization;
  
  if (!bearer || !bearer.startsWith('Bearer ')) {
    return next(new AppError('Access token is required', 401));
  }

  const token = bearer.split(' ')[1];
  
  if (!token) {
    return next(new AppError('Invalid token format', 401));
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = decoded;
    console.log(decoded)
    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = auth;
