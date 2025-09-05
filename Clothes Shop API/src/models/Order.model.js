const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
        size: { type: String, required: true },
        color: { type: String, required: true },
    }],
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'shipping', 'delivered', 'canceled'], default: 'pending' },
    paymentMethod: { type: String }, // 'COD', 'Stripe', 'VNPay'
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'failed'], default: 'unpaid' },
    shippingCode: { type: String },
    total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);