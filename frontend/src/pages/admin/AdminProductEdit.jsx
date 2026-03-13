import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import {
    Save,
    ArrowLeft,
    Upload,
    X,
    Package,
    Tag,
    DollarSign,
    Layers,
    FileText,
    Loader,
    Image as ImageIcon,
    MoreHorizontal,
    Box,
    Sparkles,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const AdminProductEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = id !== undefined;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        brand: '',
        category: '',
        stock: 0,
        discount: 0,
        images: []
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories and product data in parallel for better performance
                const fetchCategoriesPromise = api.get('/categories');
                const fetchProductPromise = isEdit ? api.get(`/products/${id}`) : Promise.resolve(null);

                const [catRes, prodRes] = await Promise.all([
                    fetchCategoriesPromise.catch(err => { console.error('Categories fetch failed', err); return { data: [] }; }),
                    fetchProductPromise.catch(err => { console.error('Product fetch failed', err); return null; })
                ]);

                setCategories(catRes.data);

                if (prodRes && prodRes.data) {
                    const prodData = prodRes.data;
                    setFormData({
                        ...prodData,
                        category: prodData.category?._id || prodData.category || ''
                    });
                } else if (isEdit) {
                    toast.error('Could not retrieve product data');
                }
            } catch (error) {
                console.error('Data retrieval failed', error);
                toast.error('Initialization failed');
            } finally {
                setFetching(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id, isEdit]);

    const getPublicIdFromUrl = (url) => {
        if (!url || !url.includes('cloudinary')) return null;
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        const folderPart = parts[parts.length - 2];
        const name = lastPart.split('.')[0];
        return `${folderPart}/${name}`;
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append('image', file);
        setUploading(true);

        try {
            const { data } = await api.post('/uploads', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // data now contains { image, public_id }
            setFormData({ ...formData, images: [...formData.images, data.image] });
            toast.success('Asset integrated into product');
        } catch (error) {
            toast.error('Asset upload rejected');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = async (index) => {
        const imageUrl = formData.images[index];
        const publicId = getPublicIdFromUrl(imageUrl);

        if (publicId) {
            try {
                await api.delete(`/uploads/${publicId}`);
            } catch (error) {
                console.error('Failed to delete image from Cloudinary', error);
            }
        }

        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/products/${id}`, formData);
                toast.success('Product specs updated');
            } else {
                await api.post('/products', formData);
                toast.success('New product launched in catalog');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Data Vault...</p>
        </div>
    );

    return (
        <div className="pb-32 container-max">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                <div className="flex items-center gap-8">
                    <Link to="/admin/products" className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary/20 transition-all shadow-sm group">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="purple" className="px-3 py-1 font-black uppercase text-[9px] tracking-widest">Global Catalog</Badge>
                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Inventory Matrix</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            {isEdit ? 'Refine Product' : 'Establish Product'}
                        </h1>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate('/admin/products')} className="h-14 px-8 border-slate-200">
                        Discard
                    </Button>
                    <Button isLoading={loading} onClick={handleSubmit} className="h-14 px-10 shadow-2xl shadow-brand-primary/20">
                        <Save className="mr-2" size={20} />
                        {isEdit ? 'Commit Changes' : 'Publish to Store'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Core Specifications */}
                <div className="lg:col-span-8 space-y-12">
                    <Card className="p-10 md:p-14 space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                        <div className="relative z-10 space-y-12">
                            <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                    <Box size={20} />
                                </div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Core Information</h2>
                            </div>

                            <div className="space-y-10">
                                <Input
                                    label="Product Identity (Name)"
                                    icon={Tag}
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter premium product title..."
                                    className="text-lg font-black h-16"
                                />

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                                        <FileText size={12} /> Detailed Description & Specs
                                    </label>
                                    <textarea
                                        required
                                        rows="10"
                                        className="w-full px-8 py-6 rounded-3xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none resize-none font-medium text-slate-600 leading-relaxed text-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Articulate the value proposition and technical details..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <Input
                                        label="Signature Brand"
                                        icon={Sparkles}
                                        required
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="Manufacturer label"
                                    />
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Layers size={12} /> Taxonomy Category
                                        </label>
                                        <div className="relative group">
                                            <select
                                                required
                                                className="w-full px-8 h-16 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none appearance-none font-black text-slate-900 cursor-pointer"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="">Select Classification</option>
                                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-brand-primary transition-colors">
                                                <MoreHorizontal size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Media Vault */}
                    <Card className="p-10 md:p-14 space-y-12">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                            <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Media Imagery Vault</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {formData.images.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    layout
                                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50"
                                >
                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-slate-200 font-black text-[8px] uppercase tracking-tighter text-slate-500">
                                        Slot 0{idx + 1}
                                    </div>
                                </motion.div>
                            ))}
                            <label className={`aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-brand-primary/30 transition-all group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                {uploading ? <Loader className="w-8 h-8 animate-spin text-brand-primary" /> : <Upload className="w-10 h-10 text-slate-200 group-hover:text-brand-primary group-hover:-translate-y-1 transition-all" />}
                                <span className="text-[9px] font-black text-slate-400 mt-4 uppercase tracking-[0.25em]">Add Asset</span>
                                <input type="file" className="hidden" onChange={handleUpload} />
                            </label>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 text-center italic">Supported: JPG, PNG, WEBP (Max 5MB). High resolution recommended for premium gallery rendering.</p>
                    </Card>
                </div>

                {/* Economic Matrix */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-10 space-y-10 relative overflow-hidden text-white bg-slate-900 border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-primary">
                                    <DollarSign size={20} />
                                </div>
                                <h2 className="text-sm font-black uppercase tracking-widest">Financial Matrix</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Valuation</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary font-black text-xl">$</span>
                                        <input
                                            type="number"
                                            required
                                            className="w-full pl-12 pr-8 h-20 rounded-3xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none font-black text-3xl tracking-tighter"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium px-2 italic">Standard pricing before applied taxes.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount %</label>
                                        <input
                                            type="number"
                                            className="w-full px-8 h-16 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-primary/30 outline-none font-black text-xl"
                                            value={formData.discount}
                                            onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Units In Stock</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-8 h-16 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-primary/30 outline-none font-black text-xl"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <label className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 rounded-lg bg-white/10 border-white/20 text-brand-primary focus:ring-brand-primary/20 accent-brand-primary"
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        />
                                        <span className="text-xs font-black uppercase tracking-widest">Featured</span>
                                    </label>
                                    <label className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 rounded-lg bg-white/10 border-white/20 text-brand-secondary focus:ring-brand-secondary/20 accent-brand-secondary"
                                            checked={formData.isBestSeller}
                                            onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                                        />
                                        <span className="text-xs font-black uppercase tracking-widest">Bestseller</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 border-2 border-slate-50 text-center space-y-6">
                        <Shield size={32} className="mx-auto text-brand-primary/40" />
                        <div className="space-y-2">
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-tighter">System Integrity</h4>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed px-4">Ensure all data aligns with global taxonomy standards before deployment.</p>
                        </div>
                    </Card>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-20 text-xl font-black shadow-[0_24px_48px_-12px_rgba(99,102,241,0.3)] group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="relative z-10 flex items-center">
                            {loading ? <Loader className="w-8 h-8 animate-spin" /> : (
                                <>
                                    <Sparkles className="mr-3" size={24} />
                                    {isEdit ? 'Authorize Refinement' : 'Deploy To Production'}
                                </>
                            )}
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductEdit;
