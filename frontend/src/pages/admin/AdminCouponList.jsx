import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Plus,
    Ticket,
    Calendar,
    Trash2,
    Tag,
    Percent,
    Users,
    Clock,
    Save,
    X,
    Loader,
    Zap,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminCouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ code: '', discount: 0, expiryDate: '', usageLimit: 0 });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/coupons');
            setCoupons(data);
        } catch (error) {
            toast.error('Failed to load coupon registry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/coupons', formData);
            toast.success('Promotional campaign ignited', {
                style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
            });
            setIsEditing(false);
            setFormData({ code: '', discount: 0, expiryDate: '', usageLimit: 0 });
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to authorize coupon generation');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Terminate this promotional code? Current holders will no longer be able to use it.')) {
            try {
                await api.delete(`/coupons/${id}`);
                toast.success('Campaign deactivated');
                fetchCoupons();
            } catch (error) {
                toast.error('Deactivation failed');
            }
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-brand-accent font-black uppercase tracking-[0.2em] text-xs">
                        <Zap size={16} />
                        <span>Loyalty Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Promotions
                    </h1>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="h-14 px-8 shadow-2xl shadow-brand-accent/20 bg-brand-accent hover:bg-rose-600">
                        <Plus size={20} className="mr-2" />
                        Generate Coupon
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Coupon Cards */}
                <div className="lg:col-span-7 space-y-8">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            [1, 2].map(n => <div key={n} className="h-44 bg-slate-50 rounded-[3rem] animate-pulse"></div>)
                        ) : coupons.length === 0 ? (
                            <Card className="p-24 text-center border-dashed border-2 bg-slate-50/50">
                                <Ticket size={48} className="mx-auto text-slate-200 mb-6" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No campaigns active</p>
                            </Card>
                        ) : coupons.map((coupon, idx) => (
                            <motion.div
                                key={coupon._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="relative bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between group overflow-hidden"
                            >
                                {/* Ticket Notch simulation */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 rounded-full bg-zinc-50 border-r border-slate-100 hidden md:block" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 rounded-full bg-zinc-50 border-l border-slate-100 hidden md:block" />

                                <div className="flex items-center gap-10 w-full md:w-auto">
                                    <div className="w-24 h-24 bg-brand-accent/5 rounded-[2.5rem] flex flex-col items-center justify-center text-brand-accent border border-brand-accent/10 relative shrink-0">
                                        <Percent className="w-6 h-6 mb-1" />
                                        <span className="text-xl font-black tracking-tighter">{coupon.discount}%</span>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent rounded-full border-4 border-white" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-3xl font-black text-slate-900 tracking-[0.1em] font-mono group-hover:text-brand-accent transition-colors">
                                                {coupon.code}
                                            </h3>
                                            <Badge variant="red" className="px-3 py-1 text-[10px] font-black uppercase tracking-widest">Active</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-2"><Calendar size={14} className="text-slate-300" /> Ends: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-2"><History size={14} className="text-slate-300" /> Usage: {coupon.usedCount || 0} / {coupon.usageLimit}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-8 md:mt-0 relative z-10 w-full md:w-auto justify-end">
                                    <button
                                        onClick={() => deleteHandler(coupon._id)}
                                        className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-12"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Creation Panel */}
                <div className="lg:col-span-5 sticky top-28">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] space-y-12"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Deploy Coupon</h3>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Growth Marketing</p>
                                    </div>
                                    <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Promotional Keycode</label>
                                        <input
                                            required
                                            className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-brand-accent/5 transition-all font-black text-2xl tracking-[0.15em] font-mono text-slate-900 placeholder:text-slate-200"
                                            placeholder="VIPFLASH50"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Discount (%)</label>
                                            <div className="relative">
                                                <Percent className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none" />
                                                <input
                                                    type="number"
                                                    required
                                                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-brand-accent/5 transition-all font-black text-slate-900"
                                                    value={formData.discount}
                                                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Redeem Limit</label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-brand-accent/5 transition-all font-black text-slate-900"
                                                value={formData.usageLimit}
                                                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Deactivation Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none" />
                                            <input
                                                type="date"
                                                required
                                                className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-brand-accent/5 transition-all font-black text-slate-900"
                                                value={formData.expiryDate}
                                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-16 text-lg bg-brand-accent hover:bg-rose-600 shadow-2xl shadow-brand-accent/20"
                                    >
                                        <Save className="mr-3" size={20} />
                                        <span>Ignite Campaign</span>
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-brand-accent text-white p-14 rounded-[4rem] shadow-2xl shadow-brand-accent/20 text-center space-y-10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-lg backdrop-blur-sm">
                                        <Zap size={48} className="fill-white" />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight leading-tight">Sales Acceleration</h3>
                                    <p className="text-white/80 font-medium leading-relaxed">
                                        Targeted promotions can drive a 40% surge in customer engagement during critical market windows. Design a campaign that converts.
                                    </p>
                                    <div className="pt-10 border-t border-white/10 mt-10">
                                        <Badge variant="white" className="text-[10px] font-black tracking-widest bg-white text-brand-accent border-none py-2 px-6">Proprietary Strategy</Badge>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminCouponList;
