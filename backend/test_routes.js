const express = require('express');
const router = express.Router();

try {
    const authRoutes = require('./routes/authRoutes');
    console.log('authRoutes loaded');
} catch (e) {
    console.error('authRoutes failed:', e.message);
}

try {
    const productRoutes = require('./routes/productRoutes');
    console.log('productRoutes loaded');
} catch (e) {
    console.error('productRoutes failed:', e.message);
}

try {
    const orderRoutes = require('./routes/orderRoutes');
    console.log('orderRoutes loaded');
} catch (e) {
    console.error('orderRoutes failed:', e.message);
}

try {
    const paymentRoutes = require('./routes/paymentRoutes');
    console.log('paymentRoutes loaded');
} catch (e) {
    console.error('paymentRoutes failed:', e.message);
}

try {
    const settingRoutes = require('./routes/settingRoutes');
    console.log('settingRoutes loaded');
} catch (e) {
    console.error('settingRoutes failed:', e.message);
}
