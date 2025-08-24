const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req); // object type
    if (!errors.isEmpty()) {
        // transfer into array, in order to re-format error json => using array() method
        const formattedErrors = errors.array().map(error => ({ 
            // instead of using "return" keyword, use a direct object to get the value
            field: error.path, 
            message: error.msg,
            value: error.value
        }))  

        return res.status(400).json({
            success: false, 
            message: "Validation failed", 
            errors: formattedErrors
        })
    }
    next();
}

module.exports = validateRequest;