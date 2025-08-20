const success = (res, data, status = 200, meta) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
};

const failure = (res, error, status = 400) => {
  const payload = {
    success: false,
    error: {
      message: (error && error.message) || String(error),
      code: (error && (error.code || error.statusCode)) || status,
    },
  };
  return res.status(status).json(payload);
};

module.exports = { success, failure };
