const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus, getInvoice } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/invoice', protect, getInvoice);

router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
