const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const jwtSign = (id, role) => {
    try {
        return jwt.sign(
            { id, role },
            JWT_SECRET,
            { expiresIn: '1h' }
        )
    } catch (error) {
        console.error("Error: ", error)
    }
}

module.exports = jwtSign;