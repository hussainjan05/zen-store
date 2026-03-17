const User = require('../models/User');
const OTP = require('../models/OTP');
const generateOTP = require('../utils/otpGenerator');
const sendEmailOTP = require('../utils/emailService');
const generateToken = require('../utils/tokenHelper');
const bcrypt = require('bcryptjs');
const { emitEvent } = require('../utils/socket');

/**
 * @desc    Send OTP to email
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOTP = async (req, res) => {
    const { email, otp } = req.body;
    console.log('OTP Request received for email:', email);

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // OTP is sent from frontend via EmailJS, backend only stores it
        const otpCode = otp || generateOTP();

        // Hash OTP before storing
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otpCode, salt);

        // Remove any existing OTP for this email
        await OTP.deleteOne({ email });

        // Store new OTP
        await OTP.create({
            email,
            otp: hashedOTP,
        });

        console.log(`OTP stored for ${email}`);
        res.status(200).json({ success: true, message: 'OTP stored successfully' });
    } catch (error) {
        console.error('OTP Store Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Verify OTP and Log in
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        // Verify OTP code
        const isMatch = await bcrypt.compare(otp, otpRecord.otp);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid - delete it
        await OTP.deleteOne({ _id: otpRecord._id });

        // Find or Create user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email });
        }

        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend
 * @access  Public
 */
const resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const otpCode = generateOTP();

        // Hash OTP
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otpCode, salt);

        // Update existing OTP or create new
        await OTP.findOneAndUpdate(
            { email },
            { otp: hashedOTP, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send via NodeMailer from backend (New Requirement)
        try {
            await sendEmailOTP(email, otpCode);
        } catch (emailError) {
            console.error('Email send failed during resend:', emailError);
        }

        res.status(200).json({ success: true, message: 'OTP regenerated and sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get User Profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            phoneNumber: user.phoneNumber,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

            if (req.body.address) {
                user.address = {
                    street: req.body.address.street || user.address?.street,
                    city: req.body.address.city || user.address?.city,
                    state: req.body.address.state || user.address?.state,
                    zipCode: req.body.address.zipCode || user.address?.zipCode,
                    country: req.body.address.country || user.address?.country,
                };
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            emitEvent('user:updated', updatedUser);

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                address: updatedUser.address,
                phoneNumber: updatedUser.phoneNumber,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    resendOTP,
    getUserProfile,
    updateUserProfile,
};
