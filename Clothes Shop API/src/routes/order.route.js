const express = require('express');
const { restrictToRole } = require('../middlewares/role.middleware');
const { createOrder, cancelOrder, getOrders, getOrder, updateOrderStatus } = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', auth, restrictToRole('user'), createOrder);
router.patch('/:orderId/cancel-order', auth, restrictToRole('user'), cancelOrder);
router.patch('/:orderId/update-order-status', auth, restrictToRole('admin'), updateOrderStatus);
router.get('/', auth, getOrders);
router.get('/:orderId', auth, getOrder);

module.exports = router