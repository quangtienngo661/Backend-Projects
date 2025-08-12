const success = (res, data, status = 200, meta) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
};

module.exports = { success };
