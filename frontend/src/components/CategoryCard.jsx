import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const CategoryCard = ({ category, gradient, index }) => {
    return (
        <Link to={`/categories?cat=${category._id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`p-6 h-32 rounded-3xl bg-gradient-to-br ${gradient.split(' ').slice(0, 2).join(' ')} border border-white/60 shadow-xl backdrop-blur-md flex flex-col items-center justify-center gap-2 cursor-pointer group transition-all relative overflow-hidden`}
            >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-white/20 transition-colors" />

                <div className={`text-2xl group-hover:scale-110 transition-transform ${gradient.split(' ').pop()}`}>
                    {category.name.split(' ')[0][0]}
                </div>
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-700">{category.name}</span>

                <div className="absolute bottom-2 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <ChevronRight size={14} className={gradient.split(' ').pop()} />
                </div>
            </motion.div>
        </Link>
    );
};

export default CategoryCard;
