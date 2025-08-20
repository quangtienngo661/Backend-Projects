const ENV = require('../configs/env');
require('dotenv').config();

module.exports = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isProd = ENV.NODE_ENV === 'production';

  const payload = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.statusCode || undefined,
    },
  };

  if (!isProd) {
    payload.error.stack = err.stack;
    payload.error.details = err.details || undefined;
  }

  return res.status(statusCode).json(payload);
};
