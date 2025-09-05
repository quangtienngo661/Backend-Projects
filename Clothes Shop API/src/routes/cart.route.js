const express = require('express');
const router = express.Router();
const { productsInCart, addToCart, removeFromCart, updateItemQuantity } = require('../controllers/cart.controller');
const auth = require('../middlewares/auth.middleware');
const { restrictToRole } = require('../middlewares/role.middleware');

router.get('/', auth, restrictToRole('user'), productsInCart);
router.post('/', auth, restrictToRole('user'), addToCart);
router.put('/item/:itemId', auth, restrictToRole('user'), updateItemQuantity);
router.delete('/item/:itemId', auth, restrictToRole('user'), removeFromCart);

module.exports = router;