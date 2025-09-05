const express = require('express');
const { restrictToRole } = require('../middlewares/role.middleware');
const { createOrder, cancelOrder, orderHistory } = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', auth, restrictToRole('user'), createOrder);
router.patch('/:orderId', auth, restrictToRole('user'), cancelOrder);
router.get('/orderHistory', auth, restrictToRole('user'), orderHistory);

module.exports = router