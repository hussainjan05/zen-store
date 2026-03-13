const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String, // URL to category image
    },
    subcategories: [{
        name: String,
        description: String,
    }],
}, {
    timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
