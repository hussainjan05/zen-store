import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { FileText, ChevronRight, CheckCircle, Package, Truck, Home, User, Mail, MapPin, ShieldCheck, Printer, ArrowLeft, CreditCard, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const OrderScreen = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                console.error(error);
                toast.error('Could not fetch order data');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
        window.scrollTo(0, 0);
    }, [id]);

    const updateStatusHandler = async (status) => {
        try {
            const { data } = await api.put(`/orders/${id}/status`, { status });
            setOrder(data);
            toast.success('Order status updated succesfully', {
                style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin" />
            <p className="text-slate-500 font-bold animate-pulse">Retrieving order details...</p>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
            <Package size={64} className="text-slate-200" />
            <h2 className="text-2xl font-black text-slate-900">Order not found</h2>
            <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
    );

    const steps = [
        { label: 'Placed', icon: Home, active: true },
        { label: 'Processing', icon: Package, active: order.orderStatus !== 'Pending' },
        { label: 'Shipped', icon: Truck, active: ['Shipped', 'Delivered'].includes(order.orderStatus) },
        { label: 'Delivered', icon: CheckCircle, active: order.orderStatus === 'Delivered' },
    ];

    return (
        <div className="pt-24 pb-32 bg-white min-h-screen">
            <div className="container-max">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-slate-400 hover:text-brand-primary mb-4 transition-colors font-bold text-sm"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to History</span>
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            Order Reference
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <span className="px-3 py-1 bg-slate-100 rounded-lg font-mono text-sm font-black text-slate-600 uppercase tracking-tighter">
                                ORD-{order._id.slice(-12).toUpperCase()}
                            </span>
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            <span className="text-slate-500 text-sm font-bold">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            <Badge variant={order.orderStatus === 'Delivered' ? 'green' : 'blue'}>{order.orderStatus}</Badge>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="h-14 px-8 border-slate-200 group">
                            <Printer size={18} className="mr-2 group-hover:text-brand-primary" />
                            Invoice
                        </Button>
                        <Button className="h-14 px-8 shadow-2xl shadow-brand-primary/20">
                            Track Shipment
                        </Button>
                    </div>
                </div>

                {/* Tracking Progress */}
                <Card className="p-12 md:p-16 mb-16 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50" />
                    <div className="absolute top-0 left-0 h-1.5 bg-brand-primary transition-all duration-1000" style={{ width: `${(steps.filter(s => s.active).length / steps.length) * 100}%` }} />

                    <div className="max-w-4xl mx-auto relative flex justify-between items-center">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <div key={idx} className="relative z-10 flex flex-col items-center">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: step.active ? 1.1 : 1,
                                            backgroundColor: step.active ? '#6366f1' : '#f8fafc'
                                        }}
                                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl transition-all duration-500 ${step.active ? 'text-white' : 'text-slate-300'}`}
                                    >
                                        <Icon size={24} strokeWidth={2.5} />
                                    </motion.div>
                                    <span className={`mt-6 text-xs font-black uppercase tracking-widest ${step.active ? 'text-slate-900' : 'text-slate-300'}`}>
                                        {step.label}
                                    </span>
                                    {step.active && (
                                        <motion.div
                                            layoutId="step-indicator"
                                            className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Side: Order Items */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <Package size={20} />
                            </div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em]">Ordered Items</h3>
                        </div>

                        <div className="space-y-6">
                            {order.orderItems.map((item, idx) => (
                                <Card key={idx} className="p-6 flex items-center gap-8 group">
                                    <div className="w-24 h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                        <img src={item.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h4 className="text-xl font-black text-slate-900 group-hover:text-brand-primary transition-colors leading-tight">{item.name}</h4>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Quantity: {item.qty} x ${item.price}</p>
                                        <div className="flex gap-4 pt-1">
                                            <Link to={`/product/${item.product}`} className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                                                View Product <ExternalLink size={10} />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-slate-900 tracking-tight">${(item.qty * item.price).toFixed(2)}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Admin Controls */}
                        {user?.role === 'admin' && (
                            <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-primary">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <h3 className="text-lg font-black uppercase tracking-widest">Admin Control Panel</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                                            <select
                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-black text-lg focus:ring-4 focus:ring-brand-primary/20 transition-all outline-none"
                                                value={order.orderStatus}
                                                onChange={(e) => updateStatusHandler(e.target.value)}
                                            >
                                                <option className="text-slate-900" value="Pending">Pending</option>
                                                <option className="text-slate-900" value="Processing">Processing</option>
                                                <option className="text-slate-900" value="Shipped">Shipped</option>
                                                <option className="text-slate-900" value="Delivered">Delivered</option>
                                                <option className="text-slate-900" value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <Button variant="secondary" className="h-16 w-full text-slate-900 font-black">
                                            Notify Customer
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Info Summary */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Delivery Addres */}
                        <div className="bg-slate-50/80 rounded-[2.5rem] p-10 border border-slate-100 border-dashed">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                    <MapPin size={20} />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Shipping Destination</h3>
                            </div>
                            <div className="space-y-4 font-medium text-slate-700">
                                <p className="font-black text-slate-900">{order.user?.name || 'Valued Customer'}</p>
                                <p className="flex items-center gap-3 text-sm text-slate-500">
                                    <Mail size={14} className="text-slate-300" />
                                    {order.user?.email}
                                </p>
                                <div className="pt-4 mt-4 border-t border-slate-200/60 leading-relaxed text-sm">
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                    <p className="font-black text-slate-900 mt-1 uppercase tracking-tighter">{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Calculation */}
                        <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-primary">
                                        <CreditCard size={20} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest">Billing Summary</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        <span>Payment Method</span>
                                        <span className="text-white font-black text-xs">{order.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Subtotal Items</span>
                                        <span className="font-black">${order.itemsPrice?.toFixed(2) || (order.totalPrice - (order.taxPrice + order.shippingPrice)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sales Tax</span>
                                        <span className="font-black">${order.taxPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Shipping Fee</span>
                                        <span className="font-black">${order.shippingPrice.toFixed(2)}</span>
                                    </div>

                                    <div className="pt-10 border-t border-white/10 mt-10">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-brand-primary uppercase tracking-widest mb-1">Grand Paid Amount</span>
                                            <span className="text-5xl font-black tracking-tighter text-white">${order.totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-2 border-slate-100 rounded-[2.5rem] text-center">
                            <ShieldCheck size={32} className="mx-auto text-emerald-500 mb-4" />
                            <p className="font-black text-slate-900 text-sm">Verified Transaction</p>
                            <p className="text-xs text-slate-400 font-medium mt-1">This order is protected by our SSL security protocols.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;
