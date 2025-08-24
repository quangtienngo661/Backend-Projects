const success = (res, data, status = 200, meta) => {
    const payload = { success: true, data };
    if (meta) payload.meta = meta;
    return res.status(status).json(payload);
}

const failure = (res, err, status = 500) => {
    const payload = {
        success: false, 
        error: {
            message: (err && err.message) || 'Internal Server Error', 
            code: err && (err.code || err.status) || status
        }
    };
    return res.status(status).json(payload);
}

module.exports = { success, failure };