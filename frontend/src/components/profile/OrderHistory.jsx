import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Package, ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data.orders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('order:placed', (newOrder) => {
                setOrders(prev => [newOrder, ...prev].slice(0, 10)); // Keep top 10 for mini view
            });

            socket.on('order:updated', (updatedOrder) => {
                setOrders(prev => prev.map(order =>
                    order._id === updatedOrder._id ? updatedOrder : order
                ));
            });

            return () => {
                socket.off('order:placed');
                socket.off('order:updated');
            };
        }
    }, [socket]);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Delivered': return 'green';
            case 'Processing': return 'blue';
            case 'Shipped': return 'purple';
            case 'Cancelled': return 'red';
            default: return 'yellow';
        }
    };

    if (loading) return <div className="text-center py-10">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <Package size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em]">Recent Orders</h3>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">No orders found yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-brand-primary/30 transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-xs font-black text-slate-400 font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                                        <Badge variant={getStatusVariant(order.orderStatus)} className="text-[10px] py-0.5">
                                            {order.orderStatus}
                                        </Badge>
                                    </div>
                                    <div className="text-sm font-bold text-slate-900">
                                        {new Date(order.createdAt).toLocaleDateString()} • ${order.totalPrice.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <Link to={`/order/${order._id}`} className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all">
                                <ChevronRight size={18} />
                            </Link>
                        </motion.div>
                    ))}
                    {orders.length > 5 && (
                        <Link to="/orders" className="block text-center text-brand-primary font-black text-sm hover:underline mt-4">
                            View All Orders
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
