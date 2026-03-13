import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            _id: product._id,
            name: product.name || product.title,
            image: product.images?.[0] || product.thumbnail,
            price: product.price,
            countInStock: product.stock,
            qty: 1
        });
        toast.success(`${product.name || product.title} added to cart!`);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group bg-white rounded-3xl border border-slate-100 p-3 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative"
        >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50">
                <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img
                        src={product.images?.[0] || product.thumbnail}
                        alt={product.name || product.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <div className="absolute bottom-3 right-3 flex flex-col gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button
                        onClick={handleAddToCart}
                        className="p-3 bg-white text-indigo-600 rounded-xl shadow-xl hover:bg-indigo-600 hover:text-white transition-all transform active:scale-90"
                        title="Add to Cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <Link
                        to={`/product/${product._id}`}
                        className="p-3 bg-indigo-600 text-white rounded-xl shadow-xl hover:bg-indigo-700 transition-all transform active:scale-90"
                        title="View Details"
                    >
                        <Eye size={20} />
                    </Link>
                </div>

                {product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-rose-500/20 pointer-events-none">
                        -{Math.round(product.discountPercentage)}%
                    </div>
                )}
            </div>

            <div className="mt-4 px-2 pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{product.category?.name || product.category}</p>
                        <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.name || product.title}</h3>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-indigo-600">${product.price}</p>
                        {product.discountPercentage > 0 && (
                            <p className="text-[10px] text-slate-400 line-through">
                                ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
