const Order = require('../models/Order');
const Product = require('../models/Product');
const { emitEvent } = require('../utils/socket');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();
            emitEvent('order:placed', createdOrder);
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
const getMyOrders = async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.pageNumber) || 1;
        const count = await Order.countDocuments({ user: req.user._id });
        const orders = await Order.find({ user: req.user._id })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });
        res.json({ orders, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getOrders = async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 20;
        const page = Number(req.query.pageNumber) || 1;
        const count = await Order.countDocuments({});
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });
        res.json({ orders, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = req.body.status || order.orderStatus;
            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            emitEvent('order:updated', updatedOrder);
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get order invoice (HTML)
 * @route   GET /api/orders/:id/invoice
 * @access  Private
 */
const getInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invoice - ${order._id}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 40px; color: #334155; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
                        .logo { font-size: 24px; font-weight: 800; color: #0ea5e9; }
                        .details { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                        .section-title { font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; color: #94a3b8; margin-bottom: 10px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 40px; }
                        th { text-align: left; border-bottom: 1px solid #f1f5f9; padding: 10px; font-size: 12px; color: #94a3b8; }
                        td { padding: 15px 10px; border-bottom: 1px solid #f1f5f9; }
                        .total-section { margin-top: 40px; text-align: right; }
                        .total-row { display: flex; justify-content: flex-end; margin-bottom: 10px; }
                        .total-label { color: #94a3b8; margin-right: 20px; }
                        .grand-total { font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 20px; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="no-print" style="margin-bottom: 20px;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Print Invoice</button>
                    </div>
                    <div class="header">
                        <div>
                            <div class="logo">ZENSTORE</div>
                            <p>Premium E-commerce Solutions</p>
                        </div>
                        <div style="text-align: right">
                            <h1 style="margin: 0">INVOICE</h1>
                            <p>#${order._id.toString().toUpperCase()}</p>
                            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div class="details">
                        <div>
                            <div class="section-title">Billed To</div>
                            <p><strong>${order.user?.name || 'Customer'}</strong></p>
                            <p>${order.user?.email}</p>
                        </div>
                        <div>
                            <div class="section-title">Shipping Address</div>
                            <p>${order.shippingAddress.address}</p>
                            <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
                            <p>${order.shippingAddress.country}</p>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Item Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th style="text-align: right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.orderItems.map(item => `
                                <tr>
                                    <td><strong>${item.name}</strong></td>
                                    <td>${item.qty}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td style="text-align: right">$${(item.qty * item.price).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="total-section">
                        <div class="total-row">
                            <span class="total-label">Subtotal</span>
                            <span style="width: 100px">$${order.itemsPrice.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">Shipping</span>
                            <span style="width: 100px">$${order.shippingPrice.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">Tax (10%)</span>
                            <span style="width: 100px">$${order.taxPrice.toFixed(2)}</span>
                        </div>
                        <div class="grand-total">
                            <span style="color: #94a3b8; font-size: 14px; font-weight: 400; margin-right: 20px;">Total Amount</span>
                            $${order.totalPrice.toFixed(2)}
                        </div>
                    </div>

                    <div style="margin-top: 80px; text-align: center; color: #94a3b8; font-size: 12px;">
                        <p>Thank you for shopping with ZenStore!</p>
                        <p>If you have any questions about this invoice, please contact support@zenstore.com</p>
                    </div>
                </body>
                </html>
            `;
            res.send(html);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    getInvoice,
};
