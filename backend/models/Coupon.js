const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Percentage discount
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        required: true, // Total times this coupon can be used
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
