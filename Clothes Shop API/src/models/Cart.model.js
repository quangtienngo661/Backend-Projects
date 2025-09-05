const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
        size: { type: String, required: true },
        color: { type: String, required: true },
    }]
}, { timestamps: true })

module.exports = mongoose.model('Cart', cartSchema)