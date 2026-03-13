import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    ClipboardList,
    Clock,
    CheckCircle,
    Truck,
    AlertCircle,
    Calendar,
    ArrowUpRight,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/orders?keyword=${searchTerm}&pageNumber=${page}&pageSize=10`);
            setOrders(data.orders);
            setPages(data.pages);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, searchTerm]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'green';
            case 'Shipped': return 'purple';
            case 'Processing': return 'blue';
            case 'Pending': return 'yellow';
            default: return 'red';
        }
    };

    const StatusIcon = ({ status, className }) => {
        switch (status) {
            case 'Delivered': return <CheckCircle className={className} />;
            case 'Shipped': return <Truck className={className} />;
            case 'Processing': return <Clock className={className} />;
            default: return <AlertCircle className={className} />;
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-brand-secondary font-black uppercase tracking-[0.2em] text-xs">
                        <ClipboardList size={16} />
                        <span>Fulfillment Center</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Customer Orders
                    </h1>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Button
                        variant="outline"
                        className={`h-14 px-8 border-slate-200 ${searchTerm === new Date().toISOString().split('T')[0] ? 'bg-slate-100' : ''}`}
                        onClick={() => {
                            const today = new Date().toISOString().split('T')[0];
                            setSearchTerm(searchTerm === today ? '' : today);
                        }}
                    >
                        Today's Shipments
                    </Button>
                    <div className="h-14 px-6 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl">
                        <span className="text-sm font-black uppercase tracking-widest">{orders.length} Active Orders</span>
                    </div>
                </div>
            </div>

            <Card className="p-0 overflow-hidden relative border-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                {/* Search & Meta */}
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-slate-400" />
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest underline underline-offset-8">Last 30 Days</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Order ID or email..."
                                className="pl-12 pr-6 py-3 bg-slate-50 rounded-xl border-none focus:ring-4 focus:ring-brand-secondary/5 transition-all text-sm font-medium w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors border border-slate-100">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/30 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black">
                                <th className="px-10 py-6">Reference</th>
                                <th className="px-10 py-6">Client Profile</th>
                                <th className="px-10 py-6">Timeline</th>
                                <th className="px-10 py-6">Financials</th>
                                <th className="px-10 py-6">Current Status</th>
                                <th className="px-10 py-6 text-right">Review</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(n => (
                                        <tr key={n} className="animate-pulse">
                                            <td className="px-10 py-8"><div className="h-8 bg-slate-100 rounded-xl w-32"></div></td>
                                            <td className="px-10 py-8"><div className="h-10 bg-slate-100 rounded-2xl w-48"></div></td>
                                            <td className="px-10 py-8"><div className="h-8 bg-slate-100 rounded-xl w-24"></div></td>
                                            <td className="px-10 py-8"><div className="h-8 bg-slate-100 rounded-xl w-20"></div></td>
                                            <td className="px-10 py-8"><div className="h-10 bg-slate-100 rounded-full w-32"></div></td>
                                            <td className="px-10 py-8"><div className="h-10 bg-slate-100 rounded-xl w-14 ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : orders.map((order, idx) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-brand-secondary/5 transition-all group"
                                    >
                                        <td className="px-10 py-8">
                                            <span className="font-mono font-black text-slate-400 text-xs tracking-tighter">
                                                #{order._id.slice(-12).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs uppercase cursor-default group-hover:scale-110 transition-transform">
                                                    {(order.user?.name || 'G')[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 group-hover:text-brand-secondary transition-colors">{order.user?.name || 'Guest User'}</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{order.user?.email || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xl font-black text-slate-900 tracking-tighter">
                                                ${order.totalPrice.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <Badge variant={getStatusStyle(order.orderStatus)} className="flex items-center gap-2 py-1.5 px-4">
                                                <StatusIcon status={order.orderStatus} className="w-3 h-3" />
                                                <span>{order.orderStatus}</span>
                                            </Badge>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-300 hover:text-brand-secondary hover:border-brand-secondary/30 transition-all flex items-center justify-center ml-auto group-hover:bg-brand-secondary group-hover:text-white"
                                            >
                                                <ArrowRight size={20} />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {pages > 1 && (
                    <div className="p-10 bg-slate-50/50 flex items-center justify-center gap-4 relative z-10 border-t border-slate-100">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-secondary transition-all disabled:opacity-30 shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="px-6 h-12 bg-white border border-slate-200 rounded-xl flex items-center font-black text-xs text-slate-500 uppercase tracking-widest">
                            Page {page} <span className="mx-2 text-slate-200">/</span> {pages}
                        </div>
                        <button
                            disabled={page === pages}
                            onClick={() => setPage(page + 1)}
                            className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-secondary transition-all disabled:opacity-30 shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminOrderList;
