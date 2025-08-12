const jwt = require('jsonwebtoken');

require('dotenv').config();
const ENV = require('../configs/env');

const jwtSign = (id) => {
  return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = jwtSign;
