"use client";

import { useState, useEffect } from "react";

export default function OrderCard({
    title,
    price,
    size,
    color,
    quantity,
    imageSrc,
}) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000); // لود 1 ثانیه
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="relative flex h-[96px] w-full rounded-[24px] bg-white p-2 shadow-[0_8px_8px_rgba(0,11,36,0.039)] animate-pulse">
                <div className="h-[80px] w-[80px] rounded-[24px] bg-gray-300 flex-shrink-0" />
                <div className="ml-4 flex flex-col justify-between flex-1">
                    <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="absolute top-2 right-2 h-4 w-12 bg-gray-300 rounded"></div>
                <div className="absolute top-2 right-10 h-6 w-6 bg-gray-300 rounded" />
            </div>
        );
    }

    return (
        <div className="relative flex h-[96px] w-full rounded-[24px] bg-white p-2 shadow-[0_8px_8px_rgba(0,11,36,0.039)]">
            <div className="h-[80px] w-[80px] overflow-hidden rounded-[24px] flex-shrink-0">
                <img src={imageSrc} alt={title} className="h-full w-full object-cover" />
            </div>

            <div className="ml-4 flex flex-col justify-between">
                <span className="text-[14px] text-[#757575]">{title}</span>

                <div className="flex items-center gap-2 text-[10px] text-[#c7c7c7]">
                    <span>Quantity:</span>
                    <span className="text-[#757575]">{quantity}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[#c7c7c7]">
                    <span>Size:</span>
                    <span className="text-[#757575]">{size}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[#c7c7c7]">
                    <span>Color:</span>
                    <div className="ml-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#757575]">
                        <span className="h-[10px] w-[10px] rounded-full" style={{ backgroundColor: color }} />
                    </div>
                </div>
            </div>

            <span className="absolute top-2 right-2 text-[14px] text-[#ff7643] font-medium">
                {price}
            </span>

            <div className="absolute top-2 right-10 h-6 w-6 flex items-center justify-center rounded-[4px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#c7c7c7">
                    <path d="M12 10a2 2 0 102 2 2.006 2.006 0 00-2-2zm6 0a2 2 0 102 2 2.006 2.006 0 00-2-2zm-12 0a2 2 0 102 2 2.006 2.006 0 00-2-2z" />
                </svg>
            </div>
        </div>
    );
}
