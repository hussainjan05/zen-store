import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-6 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-100/50 animate-pulse" />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-100 rounded-full w-2/3 animate-pulse" />
                        <div className="h-3 bg-slate-50 rounded-full w-1/2 animate-pulse" />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="h-6 bg-slate-100 rounded-lg w-16 animate-pulse" />
                    <div className="h-10 w-10 bg-slate-50 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
