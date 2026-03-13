import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    Star,
    CheckCircle,
    XCircle,
    Trash2,
    MessageSquare,
    User,
    Package,
    Loader,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/reviews?pageNumber=${page}`);
            setReviews(data.reviews);
            setPages(data.pages);
        } catch (error) {
            toast.error('Failed to synchronize reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page]);

    const approveHandler = async (id) => {
        try {
            await api.put(`/reviews/${id}/approve`);
            toast.success('Review authorized for public view', {
                style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
            });
            fetchReviews();
        } catch (error) {
            toast.error('Authorization failed');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Censor this review? This action will remove the feedback from the public catalog.')) {
            try {
                await api.delete(`/reviews/${id}`);
                toast.success('Feedback purged');
                fetchReviews();
            } catch (error) {
                toast.error('Purge failed');
            }
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-brand-primary font-black uppercase tracking-[0.2em] text-xs">
                        <MessageCircle size={16} />
                        <span>Sentiment Analysis</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Review Moderation
                    </h1>
                </div>
                <div className="h-14 px-6 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl">
                    <span className="text-sm font-black uppercase tracking-widest">{reviews.length} Feedbacks Pending</span>
                </div>
            </div>

            <Card className="p-0 overflow-hidden relative border-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/30 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black">
                                <th className="px-10 py-6">Contributor</th>
                                <th className="px-10 py-6">Subject Product</th>
                                <th className="px-10 py-6">Rating Matrix</th>
                                <th className="px-10 py-6">Customer Sentiment</th>
                                <th className="px-10 py-6 text-right">Moderation Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    [1, 2, 3].map(n => (
                                        <tr key={n} className="animate-pulse">
                                            <td className="px-10 py-8"><div className="h-10 bg-slate-100 rounded-xl w-40"></div></td>
                                            <td className="px-10 py-8"><div className="h-10 bg-slate-100 rounded-xl w-32"></div></td>
                                            <td className="px-10 py-8"><div className="h-8 bg-slate-100 rounded-xl w-20"></div></td>
                                            <td className="px-10 py-8"><div className="h-12 bg-slate-100 rounded-xl w-64"></div></td>
                                            <td className="px-10 py-8"><div className="h-10 bg-slate-100 rounded-full w-24 ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-32 text-center">
                                            <div className="max-w-xs mx-auto space-y-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-200">
                                                    <ShieldCheck size={32} />
                                                </div>
                                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs leading-relaxed">System Cleared: No active moderation required at this timestamp.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : reviews.map((review, idx) => (
                                    <motion.tr
                                        key={review._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-brand-primary/5 transition-all group"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs group-hover:scale-110 transition-transform">
                                                    {(review.user?.name || 'C')[0]}
                                                </div>
                                                <span className="font-black text-slate-900 truncate max-w-[120px]">{review.user?.name || 'Anonymous Contributor'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                                    {review.product?.images?.[0] ? (
                                                        <img src={review.product.images[0]} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-200"><Package size={14} /></div>
                                                    )}
                                                </div>
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[140px] leading-tight">
                                                    {review.product?.name || 'End-of-life Item'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            fill={i < review.rating ? "currentColor" : "none"}
                                                            className={i < review.rating ? "text-amber-400" : "text-slate-200"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-black text-slate-900 text-xs ml-1">{review.rating}.0</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="max-w-md">
                                                <p className="text-sm font-medium text-slate-600 line-clamp-2 leading-relaxed italic">
                                                    "{review.comment}"
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                {review.isApproved ? (
                                                    <Badge variant="green" className="py-1.5 px-4 flex items-center gap-2">
                                                        <CheckCircle size={14} />
                                                        <span>Public</span>
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => approveHandler(review._id)}
                                                        className="h-10 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20"
                                                    >
                                                        Publish
                                                    </Button>
                                                )}
                                                <button
                                                    onClick={() => deleteHandler(review._id)}
                                                    className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
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
                            className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-primary transition-all disabled:opacity-30 shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="px-6 h-12 bg-white border border-slate-200 rounded-xl flex items-center font-black text-xs text-slate-500 uppercase tracking-widest">
                            Page {page} <span className="mx-2 text-slate-200">/</span> {pages}
                        </div>
                        <button
                            disabled={page === pages}
                            onClick={() => setPage(page + 1)}
                            className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-primary transition-all disabled:opacity-30 shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminReviewList;
