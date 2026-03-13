import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({
    children,
    className,
    variant = 'indigo',
    ...props
}) => {
    const variants = {
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
        pink: 'bg-pink-50 text-pink-700 border-pink-100',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        red: 'bg-red-50 text-red-700 border-red-100',
        yellow: 'bg-amber-50 text-amber-700 border-amber-100',
        slate: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
        <span
            className={twMerge(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
