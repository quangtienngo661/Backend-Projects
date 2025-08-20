const cors = require('cors');
const ENV = require('./config/env'); // đã làm ở Sprint 0

const allowed = ENV.ALLOWED_ORIGINS?.split(',').map(s => s.trim());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true // nếu dùng cookie/jwt
}));