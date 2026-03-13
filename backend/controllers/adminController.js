const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * @desc    Get dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
    try {
        const totalRevenueResult = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

        // Monthly revenue chart data
        const revenueData = await Order.aggregate([
            { $match: { isPaid: true } },
            {
                $group: {
                    _id: { $month: '$paidAt' },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Map monthly data to 1-12 range
        const formattedRevenue = Array.from({ length: 12 }, (_, i) => {
            const monthData = revenueData.find(d => d._id === i + 1);
            return {
                month: i + 1,
                revenue: monthData ? monthData.revenue : 0
            };
        });

        const latestProducts = await Product.find({})
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalRevenue: totalRevenueResult[0] ? totalRevenueResult[0].total : 0,
            totalOrders,
            totalUsers,
            pendingOrders,
            revenueData: formattedRevenue,
            latestProducts
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
};

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Delete user (Admin)
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    deleteUser
};
