import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { ShoppingBag, ChevronRight, Package, Clock, CheckCircle, ArrowRight, ChevronLeft, Calendar, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const OrdersListScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/orders/myorders?pageNumber=${page}`);
                setOrders(data.orders);
                setPages(data.pages);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
        window.scrollTo(0, 0);
    }, [page]);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Delivered': return 'green';
            case 'Processing': return 'blue';
            case 'Shipped': return 'purple';
            case 'Cancelled': return 'red';
            default: return 'yellow';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin" />
            <p className="text-slate-500 font-bold animate-pulse">Fetching your history...</p>
        </div>
    );

    return (
        <div className="pt-24 pb-32 bg-zinc-50/50 min-h-screen">
            <div className="container-max">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-2 text-brand-primary font-black uppercase tracking-[0.2em] text-xs">
                            <Package size={16} />
                            <span>My Sanctuary</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Order History
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Spent</p>
                                <p className="text-lg font-black text-slate-900 mt-1">
                                    ${orders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 max-w-sm mx-auto">
                            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-slate-300">
                                <ShoppingBag size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No journey yet</h2>
                            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                                You haven't placed any orders with us yet. Start your shopping experience today.
                            </p>
                            <Button size="lg" onClick={() => navigate('/')} className="h-16 px-10">
                                Go To Shop
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        <AnimatePresence mode="popLayout">
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                >
                                    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                                            {/* Left: Products Preview */}
                                            <div className="flex -space-x-4">
                                                {order.orderItems.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="w-20 h-24 rounded-2xl overflow-hidden border-4 border-white bg-slate-50 shadow-lg">
                                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                {order.orderItems.length > 3 && (
                                                    <div className="w-20 h-24 rounded-2xl border-4 border-white bg-slate-900 flex items-center justify-center text-white font-black shadow-lg">
                                                        +{order.orderItems.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Middle: Order Details */}
                                            <div className="flex-1 space-y-4 text-center lg:text-left">
                                                <div>
                                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                                                        <span className="text-xs font-black text-slate-400 font-mono tracking-tighter">
                                                            ORD-{order._id.slice(-12).toUpperCase()}
                                                        </span>
                                                        <Badge variant={getStatusVariant(order.orderStatus)}>
                                                            {order.orderStatus}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-brand-primary transition-colors leading-tight">
                                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm font-bold">
                                                    <span className="flex items-center gap-2"><Package size={16} /> {order.orderItems.length} items</span>
                                                    <span className="flex items-center gap-2"><Clock size={16} /> Delivery in progress</span>
                                                </div>
                                            </div>

                                            {/* Right: Total & Action */}
                                            <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-6 lg:pt-0">
                                                <div className="text-center lg:text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bill</p>
                                                    <p className="text-3xl font-black text-slate-900 tracking-tight">
                                                        ${order.totalPrice.toFixed(2)}
                                                    </p>
                                                </div>
                                                <Link
                                                    to={`/order/${order._id}`}
                                                    className="w-16 h-16 rounded-[1.5rem] bg-slate-50 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                                                >
                                                    <ChevronRight size={28} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="pt-16 flex items-center justify-center gap-4">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-brand-primary transition-all disabled:opacity-30 shadow-sm active:scale-90"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <div className="px-6 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-900 tracking-widest text-sm">
                                    {page} <span className="text-slate-300 mx-2">/</span> {pages}
                                </div>
                                <button
                                    disabled={page === pages}
                                    onClick={() => setPage(page + 1)}
                                    className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-brand-primary transition-all disabled:opacity-30 shadow-sm active:scale-90"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersListScreen;
