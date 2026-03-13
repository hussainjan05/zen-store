const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    brand: {
        type: String,
        trim: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    isBestSeller: {
        type: Boolean,
        default: false,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Calculate discounted price
productSchema.virtual('discountedPrice').get(function () {
    return this.price - (this.price * (this.discount / 100));
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
