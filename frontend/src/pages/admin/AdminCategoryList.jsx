import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import api from '../../utils/api';
import {
    Plus,
    Layers,
    Edit,
    Trash2,
    Image as ImageIcon,
    ChevronRight,
    Upload,
    X,
    Loader,
    Save,
    LayoutGrid,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const AdminCategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '', description: '', image: '', subcategories: [] });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const socket = useSocket();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('category:changed', (data) => {
                fetchCategories();
            });
            return () => socket.off('category:changed');
        }
    }, [socket]);

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
            const { data } = await api.post('/uploads', uploadData);

            // Cleanup old image if it was a Cloudinary URL
            const oldPublicId = getPublicIdFromUrl(currentCategory.image);
            if (oldPublicId) {
                api.delete(`/uploads/${oldPublicId}`).catch(err => console.error(err));
            }

            setCurrentCategory({ ...currentCategory, image: data.image });
            toast.success('Asset uploaded successfully');
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentCategory._id) {
                await api.put(`/categories/${currentCategory._id}`, currentCategory);
                toast.success('Category architecture updated');
            } else {
                await api.post('/categories', currentCategory);
                toast.success('New category established');
            }
            setIsEditing(false);
            setCurrentCategory({ name: '', description: '', image: '', subcategories: [] });
            fetchCategories();
        } catch (error) {
            toast.error('Operation aborted due to error');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure? Deleting this category may affect associated products.')) {
            try {
                await api.delete(`/categories/${id}`);
                toast.success('Category record removed');
                fetchCategories();
            } catch (error) {
                toast.error('Delete failed - references exist');
            }
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-brand-primary font-black uppercase tracking-[0.2em] text-xs">
                        <LayoutGrid size={16} />
                        <span>Taxonomy Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Categories
                    </h1>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="h-14 px-8 shadow-2xl shadow-brand-primary/20">
                        <Plus size={20} className="mr-2" />
                        Create Taxonomy
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Taxonomy List */}
                <div className="lg:col-span-7 space-y-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            [1, 2, 3].map(n => <div key={n} className="h-32 bg-slate-50 rounded-[2.5rem] animate-pulse"></div>)
                        ) : categories.map((category, idx) => (
                            <motion.div
                                key={category._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between group hover:shadow-2xl hover:border-brand-primary/10 transition-all duration-500"
                            >
                                <div className="flex items-center gap-8 w-full md:w-auto">
                                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 group-hover:rotate-3 transition-transform duration-500">
                                        {category.image ? (
                                            <img src={category.image} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={32} /></div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{category.name}</h3>
                                        <p className="text-slate-400 text-sm font-medium line-clamp-1 max-w-xs">{category.description || 'No description provided.'}</p>
                                        <div className="pt-2">
                                            <Badge variant="purple" className="text-[10px] py-1 px-3">System Key: {category._id.slice(-6).toUpperCase()}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-6 md:mt-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                    <button
                                        onClick={() => { setCurrentCategory(category); setIsEditing(true); }}
                                        className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => deleteHandler(category._id)}
                                        className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Configuration Panel */}
                <div className="lg:col-span-5 sticky top-28">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                                {currentCategory._id ? 'Update Taxonomy' : 'Build Taxonomy'}
                                            </h3>
                                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Classification Settings</p>
                                        </div>
                                        <button
                                            onClick={() => { setIsEditing(false); setCurrentCategory({ name: '', description: '', image: '', subcategories: [] }); }}
                                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSave} className="space-y-8">
                                        <label className="block aspect-video rounded-[2.5rem] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-brand-primary/30 transition-all group relative">
                                            {currentCategory.image ? (
                                                <img src={currentCategory.image} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <>
                                                    {uploading ? <Loader className="w-8 h-8 animate-spin text-brand-primary" /> : <Upload className="w-10 h-10 text-slate-300 group-hover:text-brand-primary transition-all group-hover:-translate-y-1" />}
                                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mt-4">Visual Identifier</span>
                                                </>
                                            )}
                                            <input type="file" className="hidden" onChange={handleUpload} />
                                        </label>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label Name</label>
                                                <input
                                                    required
                                                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-brand-primary/5 transition-all font-black text-slate-900 placeholder:text-slate-300"
                                                    placeholder="e.g. Living Room Essentials"
                                                    value={currentCategory.name}
                                                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contextual Description</label>
                                                <textarea
                                                    rows="4"
                                                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm font-medium text-slate-600 resize-none placeholder:text-slate-300"
                                                    placeholder="Provide details about the classification scope..."
                                                    value={currentCategory.description}
                                                    onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="h-16 w-full text-lg shadow-2xl shadow-brand-primary/20"
                                        >
                                            <Save className="mr-3" size={20} />
                                            {currentCategory._id ? 'Commit Changes' : 'Establish Category'}
                                        </Button>
                                    </form>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900 text-white p-16 rounded-[4rem] text-center space-y-10 relative overflow-hidden shadow-2xl"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-primary/20 to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-brand-primary">
                                        <Layers size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight leading-tight">Taxonomy Intelligence</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        Well-structured hierarchies improve site navigation and customer discovery patterns. Organically organized groups lead to higher conversion rates.
                                    </p>
                                    <div className="pt-8 border-t border-white/10 mt-10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Enterprise Standard</p>
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

export default AdminCategoryList;
