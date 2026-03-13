const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, resendOTP, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend', resendOTP);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
