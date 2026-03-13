const Product = require('../models/Product');
const Category = require('../models/Category');
const { emitEvent } = require('../utils/socket');

/**
 * @desc    Get all products (with filters, sorting, pagination)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
    try {
        const pageSize = req.query.pageSize || 12;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        let category = {};
        if (req.query.category) {
            category = { category: req.query.category };
        } else if (req.query.categoryName) {
            const cat = await Category.findOne({ name: { $regex: new RegExp(`^${req.query.categoryName}$`, 'i') } });
            if (cat) {
                category = { category: cat._id };
            } else {
                // If category name doesn't exist, return empty results
                return res.json({ products: [], page: 1, pages: 0, total: 0 });
            }
        }
        const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
        const maxPrice = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};

        // Combine filters
        const filter = { ...keyword, ...category, ...minPrice, ...maxPrice };

        const count = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate('category', 'name')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort(req.query.sort === 'priceAsc' ? { price: 1 } : req.query.sort === 'priceDesc' ? { price: -1 } : { createdAt: -1 });


        res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
        res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
    try {
        const { name, price, description, images, category, brand, stock } = req.body;

        const product = new Product({
            name,
            price,
            user: req.user._id,
            images,
            brand,
            category,
            stock,
            description,
        });

        const createdProduct = await product.save();
        emitEvent('product:changed', { action: 'create', product: createdProduct });
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, images, category, brand, stock, isFeatured, isBestSeller, discount } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.images = images || product.images;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.stock = stock || product.stock;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;
            product.discount = discount !== undefined ? discount : product.discount;

            const updatedProduct = await product.save();
            emitEvent('product:changed', { action: 'update', product: updatedProduct });
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
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
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Delete images from Cloudinary
            if (product.images && product.images.length > 0) {
                for (const imgUrl of product.images) {
                    const publicId = getPublicIdFromUrl(imgUrl);
                    if (publicId) {
                        await deleteFromCloudinary(publicId);
                    }
                }
            }

            await Product.deleteOne({ _id: product._id });
            emitEvent('product:changed', { action: 'delete', id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
