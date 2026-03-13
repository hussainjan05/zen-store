const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, getAllReviews, updateReviewStatus } = require('../controllers/reviewController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);

router.get('/', protect, admin, getAllReviews);
router.put('/:id/approve', protect, admin, updateReviewStatus);

module.exports = router;
