import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, CheckCircle, ArrowLeft, Lock, Mail, ChevronRight, Phone, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const CheckoutScreen = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);

    // OTP State
    const [showOTP, setShowOTP] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    // Stripe State
    const [showStripeModal, setShowStripeModal] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shippingPrice = subtotal > 150 ? 0 : 15;
    const taxPrice = subtotal * 0.1;
    const totalPrice = subtotal + shippingPrice + taxPrice;

    const handleInitialSubmit = async (e) => {
        e.preventDefault();

        // Bypass OTP if Stripe is selected
        if (paymentMethod === 'Stripe') {
            await placeOrder();
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/send-otp', { email: user.email });
            toast.success('Verification code sent to your email!');
            setShowOTP(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const placeOrder = async () => {
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    ...item,
                    product: item.product || item._id // Ensure it's the ObjectId
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice: subtotal,
                shippingPrice,
                taxPrice,
                totalPrice,
                isPaid: false, // Will be updated via webhook or success redirect
            };
            const { data } = await api.post('/orders', orderData);

            if (paymentMethod === 'Stripe') {
                // Redirect to Stripe Checkout
                const sessionResponse = await api.post('/payment/create-checkout-session', {
                    orderItems: cartItems,
                    totalPrice,
                    orderId: data._id
                });
                window.location.href = sessionResponse.data.url;
            } else {
                toast.success('🎉 Order has been placed successfully!', {
                    duration: 5000,
                    style: {
                        borderRadius: '20px',
                        background: '#0f172a',
                        color: '#fff',
                        padding: '24px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                    }
                });
                clearCart();
                setTimeout(() => {
                    navigate(`/order/${data._id}`);
                }, 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error placing order');
        }
    };

    const handleVerifyAndPlaceOrder = async (e) => {
        e.preventDefault();
        setOtpLoading(true);
        try {
            await api.post('/auth/verify-otp', { email: user.email, otp: otpCode });
            setOtpVerified(true);
            setShowOTP(false);
            await placeOrder();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid verification code');
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-32 bg-white min-h-screen">
            <div className="container-max">
                <button
                    onClick={() => navigate('/cart')}
                    className="group flex items-center gap-2 text-slate-500 hover:text-brand-primary mb-12 transition-colors font-bold"
                >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Checkout Bag</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Checkout Form */}
                    <div className="lg:col-span-7 space-y-16">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                                    <MapPin size={28} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Delivery Details</h2>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Street Address"
                                        placeholder="Enter your full street address"
                                        required
                                        value={shippingAddress.address}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    />
                                </div>
                                <Input
                                    label="City"
                                    placeholder="San Francisco"
                                    required
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                />
                                <Input
                                    label="Postal Code"
                                    placeholder="94103"
                                    required
                                    value={shippingAddress.postalCode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Country"
                                        placeholder="United States"
                                        required
                                        value={shippingAddress.country}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                    />
                                </div>
                            </form>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary">
                                    <CreditCard size={28} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { id: 'COD', title: 'Cash On Delivery', desc: 'Pay when you receive' },
                                    { id: 'Stripe', title: 'Card Payment', desc: 'Secure online payment', disabled: false }
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={`relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${paymentMethod === method.id
                                            ? 'border-brand-primary bg-brand-primary/5 ring-4 ring-brand-primary/10'
                                            : 'border-slate-100 hover:border-slate-300'
                                            } ${method.disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-brand-primary pb-0.5' : 'border-slate-300'}`}>
                                                {paymentMethod === method.id && <div className="w-3 h-3 bg-brand-primary rounded-full" />}
                                            </div>
                                            <CreditCard size={20} className={paymentMethod === method.id ? 'text-brand-primary' : 'text-slate-300'} />
                                        </div>
                                        <h4 className="font-black text-slate-900 leading-none">{method.title}</h4>
                                        <p className="text-xs text-slate-500 mt-2 font-medium">{method.desc}</p>
                                        <input
                                            type="radio"
                                            name="payment"
                                            className="hidden"
                                            value={method.id}
                                            onChange={() => !method.disabled && setPaymentMethod(method.id)}
                                            checked={paymentMethod === method.id}
                                        />
                                    </label>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Order Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 text-white rounded-[3rem] p-10 lg:p-14 shadow-2xl lg:sticky lg:top-32 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px]" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-10 tracking-tight">Order Receipt</h3>

                                <div className="space-y-6 mb-12 max-h-[30vh] overflow-y-auto pr-4 scrollbar-hide">
                                    {cartItems.map((item) => (
                                        <div key={item.product} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl overflow-hidden border border-white/5 flex-shrink-0 flex items-center justify-center">
                                                <img src={item.image || item.images?.[0]} alt="" className="w-full h-full object-contain p-2" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">{item.qty} x ${item.price}</p>
                                            </div>
                                            <span className="font-black text-lg">${(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-10 border-t border-white/10 mb-12">
                                    <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-white">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                        <span>Shipping</span>
                                        <span className="text-white">{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4">
                                        <div>
                                            <p className="text-xs font-black text-brand-primary uppercase tracking-widest mb-1">Total Due</p>
                                            <p className="text-5xl font-black tracking-tighter">${totalPrice.toFixed(2)}</p>
                                        </div>
                                        <Badge variant="purple" className="flex items-center gap-1.5 py-1.5 px-3">
                                            <ShieldCheck size={14} />
                                            Secured
                                        </Badge>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleInitialSubmit}
                                    disabled={loading || cartItems.length === 0}
                                    className="w-full h-20 text-xl font-black group bg-brand-primary hover:bg-white hover:text-brand-primary"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-slate-300 border-t-brand-primary rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Confirm Order
                                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            <Modal
                isOpen={showOTP}
                onClose={() => setShowOTP(false)}
                title="Verify Your Purchase"
            >
                <div className="p-4 space-y-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary">
                            <Mail size={40} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 leading-none">Security Check</h3>
                            <p className="text-slate-500 mt-2 font-medium">We've sent a 6-digit verification code to <span className="font-black text-slate-900">{user.email}</span></p>
                        </div>
                    </div>

                    <form onSubmit={handleVerifyAndPlaceOrder} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Enter Code</label>
                            <input
                                autoFocus
                                required
                                maxLength={6}
                                className="w-full text-center text-4xl font-black tracking-[0.5em] py-6 px-4 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                                value={otpCode}
                                placeholder="000000"
                                onChange={(e) => setOtpCode(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-16 text-lg font-black bg-slate-900"
                            disabled={otpLoading || otpCode.length < 6}
                        >
                            {otpLoading ? (
                                <div className="w-6 h-6 border-4 border-slate-300 border-t-white rounded-full animate-spin" />
                            ) : 'Complete Purchase'}
                        </Button>

                        <p className="text-center text-xs text-slate-400 font-bold">
                            Haven't received it? <span className="text-brand-primary cursor-pointer hover:underline">Resend code</span>
                        </p>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default CheckoutScreen;
