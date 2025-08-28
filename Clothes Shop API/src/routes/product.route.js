const express = require('express');
const router = express.Router();

const { 
    getProducts, 
    getOneProduct,
    createProduct,
    bulkCreateProducts,
    updateProduct, 
    deleteProduct,
    bulkDeleteProducts
} = require("../controllers/product.controller");

const validateRequest = require('../middlewares/validator.middleware');
const { restrictToRole } = require('../middlewares/role.middleware');
const auth = require('../middlewares/auth.middleware');
const { createAndUpdateProductValidation } = require('../validations/product.validation');

router.get('/', getProducts);
router.get('/:id', getOneProduct);

router.post('/', auth, restrictToRole('admin'), createAndUpdateProductValidation, validateRequest, createProduct);
router.post('/bulk-create', auth, restrictToRole('admin'), validateRequest, bulkCreateProducts); // BETA

router.put('/:id', auth, restrictToRole('admin'), createAndUpdateProductValidation, validateRequest ,updateProduct);

router.delete('/:id', auth, restrictToRole('admin'), validateRequest ,deleteProduct);
router.delete('/bulk-delete', auth, restrictToRole('admin'), validateRequest ,bulkDeleteProducts);

module.exports = router;