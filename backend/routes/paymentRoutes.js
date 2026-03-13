const express = require('express');
const router = express.Router();
const { getStripeConfig, createPaymentIntent, createCheckoutSession } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/config', protect, getStripeConfig);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/create-checkout-session', protect, createCheckoutSession);

module.exports = router;
