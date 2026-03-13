const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Get Stripe configuration (Publishable Key)
 * @route   GET /api/payment/config
 * @access  Private
 */
const getStripeConfig = (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
};

/**
 * @desc    Create Stripe Payment Intent
 * @route   POST /api/payment/create-payment-intent
 * @access  Private
 */
const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

/**
 * @desc    Create Stripe Checkout Session
 * @route   POST /api/payment/create-checkout-session
 * @access  Private
 */
const createCheckoutSession = async (req, res) => {
    const { orderItems, totalPrice, orderId } = req.body;

    try {
        const line_items = orderItems.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image.startsWith('http') ? item.image : `${process.env.FRONTEND_URL || 'http://localhost:5173'}${item.image}`],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.qty,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            customer_email: req.user.email,
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${orderId}?success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout?canceled=true`,
            metadata: {
                orderId: orderId.toString(),
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStripeConfig,
    createPaymentIntent,
    createCheckoutSession,
};
