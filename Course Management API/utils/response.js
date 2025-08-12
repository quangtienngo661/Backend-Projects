const success = (res, data, status = 200, meta) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
};

const failure = (res, error, status) => {
  const payload = {
    success: false,
    error: {
      message: (error && error.message) || String(error),
      code: error && error.code ? error.code : undefined,
    },
  };
  return res.status(status).json(payload);
};

module.exports = { success, failure };
