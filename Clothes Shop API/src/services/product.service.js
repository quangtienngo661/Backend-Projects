const { default: mongoose } = require('mongoose');
const Product = require('../models/Product.model');
const AppError = require('../utils/AppError.util');

// limit: should be hardcoded as avoiding continous layout configuration
const limit = 20;

exports.getProducts = async (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (page - 1) * limit;
    const allowedSortFields = ['name', 'price', 'category', 'createdAt', 'updatedAt', 'stock'];
    const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : 'name';
    const direction = req.query.dir === 'desc' ? -1 : 1;

    // TODO: Add filtering capabilities (explaination before coding (FORCED))

    const [products, totalProducts] = await Promise.all([
        Product.find().sort({ [sortBy]: direction }).skip(skip).limit(limit),
        Product.countDocuments()
    ]);

    const meta = {
        page,
        limit,
        total: totalProducts,
        totalPages: Math.ceil(totalProducts / limit)
    }

    return { products, meta };
}

exports.getOneProduct = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid product ID format', 400)
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("Product not found", 404);
    }

    return product;
}

exports.createProduct = async (req, res, next) => {
    const productInfo = { ...req.body };

    const newProduct = await Product.create(productInfo);

    return newProduct;
}

exports.bulkCreateProducts = async (req, res, next) => {
    const insertedProducts = [...req.body];

    // TODO: Bulk create products validation
    let validationErrors = [];
    let validProducts = [];

    insertedProducts.forEach((product, index) => {
    });

    const newProducts = await Product.insertMany(insertedProducts);

    return newProducts;
}


exports.updateProduct = async (req, res, next) => {
    const productInfo = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid product ID format', 400)
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { ...productInfo },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedProduct) {
        throw new AppError('Product not found', 404);
    }

    return updatedProduct;
}

exports.deleteProduct = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid product ID format', 400)
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
        throw new AppError('Product not found', 404);
    }

    return deletedProduct;
}

exports.bulkDeleteProducts = async (req, res, next) => {
    // TODO: finish bulk delete products service
}


// TODO: Search products service