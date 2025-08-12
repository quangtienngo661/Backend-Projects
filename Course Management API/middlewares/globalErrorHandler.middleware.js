// const globalErrorHandler = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'Error';

//     return res.status(err.statusCode).json({
//         status: err.status,
//         statusCode: err.statusCode,
//         msg: err.message
//     })
// }

// module.exports = globalErrorHandler;

require('dotenv').config();

module.exports = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

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
