import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Card = ({
    children,
    className,
    isGlass = false,
    hoverEffect = true,
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hoverEffect ? { y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' } : {}}
            className={twMerge(
                'rounded-[var(--radius-premium)] overflow-hidden transition-all duration-300',
                isGlass ? 'glass' : 'bg-white border border-slate-100 shadow-sm',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
