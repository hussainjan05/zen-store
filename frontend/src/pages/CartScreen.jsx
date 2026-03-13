import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard, Gift, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const CartScreen = () => {
    const { cartItems, addToCart, removeFromCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return (
        <div className="pt-24 pb-32 bg-zinc-50/50 min-h-screen">
            <div className="container-max">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-brand-primary font-black uppercase tracking-[0.2em] text-xs">
                            <ShoppingCart size={16} />
                            <span>Shopping Bag</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Review your items
                            <span className="text-brand-primary ml-2">({cartItems.length})</span>
                        </h1>
                    </div>
                    <Link to="/" className="group flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-bold pb-2">
                        <span>Continue Shopping</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 max-w-md mx-auto">
                            <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3">
                                <ShoppingBag size={40} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your bag is empty</h2>
                            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                                Experience the finest curation. Browse our collections and add some premium pieces to your life.
                            </p>
                            <Button size="lg" onClick={() => navigate('/')} className="h-16 px-10">
                                Explore Collection
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* List Area */}
                        <div className="lg:col-span-8 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item, idx) => (
                                    <motion.div
                                        key={item.product}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    >
                                        <Card className="p-6 flex flex-col md:flex-row items-center gap-8 group">
                                            <div className="w-32 h-40 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            <div className="flex-1 space-y-4 text-center md:text-left">
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-tight">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                        SKU: ZEN-{String(item.product).padStart(4, '0')}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-center md:justify-start gap-8">
                                                    <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/50">
                                                        <button
                                                            onClick={() => addToCart({ _id: item.product, ...item }, Math.max(1, item.qty - 1))}
                                                            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-900 rounded-lg transition-all shadow-sm active:scale-90"
                                                        >
                                                            <Minus size={14} strokeWidth={3} />
                                                        </button>
                                                        <span className="w-12 text-center font-black text-slate-900">{item.qty}</span>
                                                        <button
                                                            onClick={() => addToCart({ _id: item.product, ...item }, Math.min(item.countInStock || 99, item.qty + 1))}
                                                            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-900 rounded-lg transition-all shadow-sm active:scale-90"
                                                        >
                                                            <Plus size={14} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.product)}
                                                        className="text-slate-400 hover:text-brand-accent transition-colors flex items-center gap-2 font-bold text-sm"
                                                    >
                                                        <Trash2 size={18} />
                                                        <span className="hidden sm:inline">Remove</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-center md:text-right">
                                                <p className="text-3xl font-black text-slate-900 tracking-tight">
                                                    ${(item.price * item.qty).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-slate-400 font-bold mt-1">
                                                    ${item.price} per unit
                                                </p>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Upsell / Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                <div className="p-8 bg-brand-primary/5 rounded-[2.5rem] border border-brand-primary/10 flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
                                        <Gift size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg">Add a gift note</h4>
                                        <p className="text-sm text-slate-500 font-medium mt-1">Make your shipment special with a customized message.</p>
                                    </div>
                                </div>
                                <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/10 flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg">Buyer Protection</h4>
                                        <p className="text-sm text-slate-500 font-medium mt-1">Secure payment and verified premium shipping.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Area */}
                        <div className="lg:col-span-4">
                            <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl lg:sticky lg:top-32 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />

                                <div className="relative z-10">
                                    <h2 className="text-2xl font-black mb-10 flex items-center justify-between">
                                        Summary
                                        <CreditCard size={28} className="text-brand-primary" />
                                    </h2>

                                    <div className="space-y-6 mb-12">
                                        <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                            <span>Subtotal</span>
                                            <span className="text-white text-lg font-black">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                            <span>Shipping</span>
                                            <span className="text-white text-lg font-black">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                            <span>Tax Estimate</span>
                                            <span className="text-white text-lg font-black">${tax.toFixed(2)}</span>
                                        </div>

                                        <div className="pt-6 border-t border-white/10 mt-6">
                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-brand-primary uppercase tracking-widest mb-1">Total Amount</span>
                                                    <span className="text-5xl font-black tracking-tight text-white">${total.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Button
                                            onClick={() => navigate('/checkout')}
                                            size="lg"
                                            className="w-full h-20 text-xl font-black group bg-brand-primary hover:bg-white hover:text-brand-primary border-none shadow-2xl shadow-brand-primary/20"
                                        >
                                            Checkout
                                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <p className="text-[10px] text-center text-slate-500 uppercase font-black tracking-[0.2em] pt-4">
                                            * Secure encrypted SSL checkout
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartScreen;
