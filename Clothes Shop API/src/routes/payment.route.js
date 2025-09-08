const express = require('express');
const { paymentCallback } = require('../controllers/payment.controller');
const router = express.Router();

router.patch('/payment-callback', paymentCallback);

module.exports = router;