const productService = require("../services/product.service")
const catchAsync = require("../utils/catchAsync.util")

const getProducts = catchAsync(async (req, res, next) => {
    const { products, meta } = await productService.getProducts(req, res, next);
    return res.ok(products, 200, meta);
})

const getOneProduct = catchAsync(async (req, res, next) => {
    const product = await productService.getOneProduct(req, res, next);
    return res.ok(product, 200);
})

const createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await productService.createProduct(req, res, next);
    return res.ok(newProduct, 201);
})


const bulkCreateProducts = async (req, res, next) => {
    const newProducts = await productService.bulkCreateProducts(req, res, next);
    return res.ok(newProducts, 201)
}

const updateProduct = catchAsync(async (req, res, next) => {
    const updatedProduct = await productService.updateProduct(req, res, next);
    return res.ok(updatedProduct, 200);
})

const deleteProduct = catchAsync(async (req, res, next) => {
    const deletedProduct = await productService.deleteProduct(req, res, next);
    return res.ok(deletedProduct, 200)
})

const bulkDeleteProducts = catchAsync(async (req, res, next) => {
    const deletedProduct = await productService.bulkDeleteProducts(req, res, next);
    return res.ok(deletedProduct, 200)
})

module.exports = {
    getProducts,
    getOneProduct,
    createProduct,
    bulkCreateProducts,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts
}