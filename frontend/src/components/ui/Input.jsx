import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({
    className,
    label,
    error,
    icon: Icon,
    ...props
}, ref) => {
    return (
        <div className="w-full space-y-2">
            {label ? (
                <label className="block text-sm font-medium text-slate-700 ml-1">
                    {label}
                </label>
            ) : null}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        'w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200',
                        Icon && 'pl-12',
                        error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 ml-1 transition-all animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
