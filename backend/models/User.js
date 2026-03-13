const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
