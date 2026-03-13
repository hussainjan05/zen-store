const Coupon = require('../models/Coupon');

/**
 * @desc    Apply coupon
 * @route   POST /api/coupons/apply
 * @access  Private
 */
const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found or inactive' });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        res.json({ discount: coupon.discount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all coupons (Admin)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Create a coupon (Admin)
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
const createCoupon = async (req, res) => {
    try {
        const { code, discount, expiryDate, usageLimit } = req.body;
        // Map usageLimit from frontend to limit in model
        const coupon = new Coupon({
            code: code.toUpperCase(),
            discount,
            expiryDate,
            usageLimit
        });
        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Delete a coupon (Admin)
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            await coupon.deleteOne();
            res.json({ message: 'Coupon removed' });
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyCoupon,
    getCoupons,
    createCoupon,
    deleteCoupon,
};
