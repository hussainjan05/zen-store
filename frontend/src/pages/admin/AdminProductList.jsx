import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    Filter,
    MoreVertical,
    Image as ImageIcon,
    Box,
    ArrowUpRight,
    Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [keyword, setKeyword] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/products?keyword=${keyword}&pageNumber=${page}&pageSize=10`);
            setProducts(data.products);
            setPages(data.pages);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const socket = useSocket();

    useEffect(() => {
        fetchProducts();
    }, [page, keyword]);

    useEffect(() => {
        if (socket) {
            socket.on('product:changed', (data) => {
                fetchProducts();
            });
            return () => socket.off('product:changed');
        }
    }, [socket]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action is irreversible.')) {
            try {
                await api.delete(`/products/${id}`);
                toast.success('Product removed from catalog', {
                    style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
                });
                fetchProducts();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Delete failed');
            }
        }
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Name', 'Price', 'Stock', 'Brand', 'Category'];
        const csvContent = [
            headers.join(','),
            ...products.map(p => [
                p._id,
                `"${p.name}"`,
                p.price,
                p.stock,
                `"${p.brand}"`,
                `"${p.category?.name || 'Uncategorized'}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Inventory manifest exported');
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-brand-primary font-black uppercase tracking-[0.2em] text-xs">
                        <Box size={16} />
                        <span>Inventory Management</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Product Catalog
                    </h1>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="h-14 px-8 border-slate-200" onClick={exportToCSV}>
                        <Download size={18} className="mr-2" />
                        Export CSV
                    </Button>
                    <Link to="/admin/products/new">
                        <Button className="h-14 px-8 shadow-2xl shadow-brand-primary/20 group">
                            <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform" />
                            Add Premium Product
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="p-0 overflow-hidden relative border-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                {/* Search & Filters */}
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Identify a product by name or brand..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none font-medium text-slate-600"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-14 px-6 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
                            <Filter size={18} className="text-slate-400" />
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Filters</span>
                        </div>
                        <div className="h-14 px-6 bg-brand-primary/5 rounded-2xl flex items-center gap-2 border border-brand-primary/10">
                            <span className="text-sm font-black text-brand-primary uppercase tracking-widest">{products.length} Items Listed</span>
                        </div>
                    </div>
                </div>

                {/* Modern Table */}
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/30 text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black">
                                <th className="px-10 py-6">Product Details</th>
                                <th className="px-10 py-6">Category</th>
                                <th className="px-10 py-6">Pricing</th>
                                <th className="px-10 py-6">Stock Status</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(n => (
                                        <tr key={n} className="animate-pulse">
                                            <td className="px-10 py-8"><div className="h-12 bg-slate-100 rounded-2xl w-64"></div></td>
                                            <td className="px-10 py-8"><div className="h-8 bg-slate-100 rounded-xl w-32"></div></td>
                                            <td className="px-10 py-8"><div className="h-8 bg-slate-100 rounded-xl w-24"></div></td>
                                            <td className="px-10 py-8"><div className="h-8 bg-slate-100 rounded-full w-40"></div></td>
                                            <td className="px-10 py-8"><div className="h-10 bg-slate-100 rounded-xl w-24 ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : products.map((product, idx) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-brand-primary/5 transition-all group cursor-pointer"
                                    >
                                        <td className="px-10 py-8" onClick={() => navigate(`/admin/products/${product._id}/edit`)}>
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-20 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={24} /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-lg leading-tight group-hover:text-brand-primary transition-colors">{product.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Brand: {product.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8" onClick={() => navigate(`/admin/products/${product._id}/edit`)}>
                                            <Badge variant="purple" className="px-4 py-1.5 font-black uppercase text-[10px] tracking-widest">
                                                {product.category?.name || 'Uncategorized'}
                                            </Badge>
                                        </td>
                                        <td className="px-10 py-8" onClick={() => navigate(`/admin/products/${product._id}/edit`)}>
                                            <div className="flex flex-col">
                                                <span className="text-xl font-black text-slate-900 tracking-tighter">${product.price.toLocaleString()}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">MSRP Included</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8" onClick={() => navigate(`/admin/products/${product._id}/edit`)}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                    product.stock > 0 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${product.stock > 10 ? 'text-emerald-600' :
                                                    product.stock > 0 ? 'text-amber-600' : 'text-rose-600'}`}>
                                                    {product.stock} Units Available
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 translate-x-4 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 relative z-20">
                                                <Link
                                                    to={`/admin/products/${product._id}/edit`}
                                                    className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteHandler(product._id); }}
                                                    className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-accent hover:border-brand-accent/30 transition-all"
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

                {/* Footer / Pagination */}
                {!keyword && pages > 1 && (
                    <div className="p-10 bg-slate-50/50 flex items-center justify-between relative z-10 border-t border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Showing page {page} of {pages} total pages
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-primary transition-all disabled:opacity-30 shadow-sm active:scale-95"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                disabled={page === pages}
                                onClick={() => setPage(page + 1)}
                                className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-primary transition-all disabled:opacity-30 shadow-sm active:scale-95"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminProductList;
