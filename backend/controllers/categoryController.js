const Category = require('../models/Category');
const { emitEvent } = require('../utils/socket');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Create a category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res) => {
    try {
        const { name, description, image, subcategories } = req.body;

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new Category({
            name,
            description,
            image,
            subcategories,
        });

        const createdCategory = await category.save();
        emitEvent('category:changed', { action: 'create', category: createdCategory });
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res) => {
    try {
        const { name, description, image, subcategories } = req.body;

        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = name || category.name;
            category.description = description || category.description;
            category.image = image || category.image;
            category.subcategories = subcategories || category.subcategories;

            const updatedCategory = await category.save();
            emitEvent('category:changed', { action: 'update', category: updatedCategory });
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const { deleteFromCloudinary } = require('../config/cloudinary');

/**
 * Helper to extract public ID from Cloudinary URL
 * @param {String} url 
 * @returns {String|null}
 */
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return null;
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const folderPart = parts[parts.length - 2];
    const name = lastPart.split('.')[0];
    return `${folderPart}/${name}`;
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            // Delete image from Cloudinary
            const publicId = getPublicIdFromUrl(category.image);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }

            await Category.deleteOne({ _id: category._id });
            emitEvent('category:changed', { action: 'delete', id: category._id });
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
