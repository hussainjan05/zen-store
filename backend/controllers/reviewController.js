const Review = require('../models/Review');
const Product = require('../models/Product');

/**
 * @desc    Create new review
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const review = new Review({
            name: req.user.name || req.user.email,
            rating: Number(rating),
            comment,
            user: req.user._id,
            product: productId,
        });

        await review.save();

        // Re-calculate product ratings after approval or immediately?
        // Requirements say "Approve / remove reviews", so we update rating ONLY after approval.
        res.status(201).json({ message: 'Review added and pending approval' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get reviews for a product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId, isApproved: true }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all reviews (Admin)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
const getAllReviews = async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 20;
        const page = Number(req.query.pageNumber) || 1;
        const count = await Review.countDocuments({});
        const reviews = await Review.find({})
            .populate('user', 'name email')
            .populate('product', 'name')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });
        res.json({ reviews, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Approve/Reject review (Admin)
 * @route   PUT /api/reviews/:id/approve
 * @access  Private/Admin
 */
const updateReviewStatus = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (review) {
            // If body.isApproved is not provided, assume true (since route is /approve)
            review.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : true;
            await review.save();

            if (review.isApproved) {
                // Update product rating
                const product = await Product.findById(review.product);
                const reviews = await Review.find({ product: review.product, isApproved: true });

                product.ratings.count = reviews.length;
                product.ratings.average = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

                await product.save();
            }

            res.json({ message: `Review status updated to ${review.isApproved ? 'Approved' : 'Rejected'}` });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    getAllReviews,
    updateReviewStatus,
};
