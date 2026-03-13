const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
