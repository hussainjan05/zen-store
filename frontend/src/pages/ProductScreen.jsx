import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ProductScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart({
            _id: product._id,
            name: product.name || product.title,
            image: product.images?.[0] || product.thumbnail,
            price: product.price,
            countInStock: product.stock,
            qty: qty
        });
        toast.success(`${product.title} added to cart!`);
    };

    if (loading) return (
        <div className="container-max px-6 py-20 flex justify-center items-center min-h-[60vh]">
            <RefreshCw className="animate-spin text-indigo-600 w-12 h-12" />
        </div>
    );

    if (!product) return (
        <div className="container-max px-6 py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <button onClick={() => navigate('/products')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Back to Gallery</button>
        </div>
    );

    const images = product.images || [product.thumbnail];

    return (
        <div className="pb-24">
            <div className="container-max px-6 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-12"
                >
                    <ArrowLeft size={18} /> Back to Products
                </button>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Image Gallery */}
                    <div className="space-y-6">
                        <motion.div
                            layoutId={`product-image-${product._id || id}`}
                            className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 relative group"
                        >
                            <img
                                src={images[selectedImage]}
                                alt={product.title}
                                className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </motion.div>

                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-indigo-600 scale-95 shadow-lg shadow-indigo-100' : 'border-slate-100 hover:border-indigo-200'
                                        }`}
                                >
                                    <img src={img} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-8">
                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest rounded-full border border-indigo-100 mb-4 inline-block">
                                {product.category?.name || product.category}
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">{product.name || product.title}</h1>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1.5 p-1 px-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                                    <Star size={16} className="fill-amber-500 text-amber-500" />
                                    <span className="font-black text-sm">{product.rating}</span>
                                    <span className="text-amber-600/60 font-medium">({Math.floor(Math.random() * 500) + 100} reviews)</span>
                                </div>
                                <span className="text-slate-400 font-bold">Brand: <span className="text-slate-900">{product.brand || 'Premium'}</span></span>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 mb-8">
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-4xl font-black text-indigo-600">${product.price}</span>
                                <span className="text-lg text-slate-400 line-through font-bold">
                                    ${(product.price * 1.25).toFixed(2)}
                                </span>
                                <span className="px-2 py-1 bg-rose-500 text-white text-[10px] font-black uppercase rounded-lg">Save 25%</span>
                            </div>
                            <p className="text-slate-500 font-medium text-sm mb-6">Tax included. Shipping calculated at checkout.</p>

                            <p className="text-slate-700 leading-relaxed mb-8">
                                {product.description}
                            </p>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1">
                                    <button
                                        disabled={qty <= 1}
                                        onClick={() => setQty(q => q - 1)}
                                        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-indigo-600 font-bold disabled:opacity-30"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-black text-slate-800">{qty}</span>
                                    <button
                                        disabled={qty >= product.stock}
                                        onClick={() => setQty(q => q + 1)}
                                        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-indigo-600 font-bold disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className={`text-sm font-bold ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Currently Unavailable'}
                                </span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-400 disabled:shadow-none"
                            >
                                <ShoppingCart size={24} /> Add to Cart
                            </button>
                        </div>

                        {/* Features List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: <Truck size={20} />, text: "Swift Worldwide Shipping", color: "text-blue-500" },
                                { icon: <ShieldCheck size={20} />, text: "2 Year Extended Warranty", color: "text-emerald-500" },
                                { icon: <RefreshCw size={20} />, text: "30-Day Easy Returns", color: "text-indigo-500" },
                                { icon: <Star size={20} />, text: "Premium Build Quality", color: "text-amber-500" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-100 transition-colors">
                                    <div className={`${item.color} p-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors`}>{item.icon}</div>
                                    <span className="text-sm font-bold text-slate-700">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;
