"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import PriceIcon from "../icons/priceIcon";
import Image from "next/image";

export default function ProductCardSEOClientWrapper({ product }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!product || !product.slug) return null;

    const specs = Array.isArray(product.specifications) ? product.specifications : [];

    const cleanTitle = product.brief_title || product.title || "محصول بدون عنوان";
    const originalPrice = product.min_price || 0;
    const discountedPrice = product.min_discounted_price || originalPrice;
    const hasDiscount = product.has_discount && originalPrice > discountedPrice;

    const ram = specs.find((s) => s.name === "مقدار RAM")?.value || "-";
    const storage = specs.find((s) => s.name === "حافظه داخلی")?.value || "-";

    return (
        <article
            dir="ltr"
            className={`w-[300px] flex rounded-[24px] shadow-[0_8px_16px_rgba(0,11,36,0.039)] overflow-hidden relative p-1 transition-colors duration-300
                ${theme === "dark" ? "bg-[#23262b]" : "bg-white"}`}
            itemScope
            itemType="http://schema.org/Product"
        >
            {loading ? (
                <>
                    <div
                        className={`flex-shrink-0 w-[80px] h-[80px] rounded-[24px] ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                            } animate-pulse mr-3 mt-2`}
                    />
                    <div className="flex flex-col justify-between flex-1">
                        <div
                            className={`h-4 w-3/4 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                                } animate-pulse mb-2`}
                        />
                        <div
                            className={`h-3 w-1/2 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                                } animate-pulse mb-1`}
                        />
                        <div
                            className={`h-3 w-2/3 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                                } animate-pulse`}
                        />
                    </div>
                </>
            ) : (
                <>
                    {hasDiscount && (
                        <span
                            aria-label="محصول دارای تخفیف"
                            className="absolute top-0 left-0 w-[47px] h-[23px] bg-[#ef5350] text-white text-[10px] font-normal flex items-center justify-center rounded-tl-[24px] rounded-br-[24px] select-none"
                        >
                            {Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}%
                        </span>
                    )}

                    <div className="flex-shrink-0 w-[80px] h-[80px] relative rounded-[24px] overflow-hidden mr-3 mt-2">
                        <Image
                            width={80}
                            height={80}
                            src={product.image || "/assets/img/placeholder.webp"}
                            alt={cleanTitle}
                            title={cleanTitle}
                            className="w-full h-full object-contain"
                            loading="lazy"
                        />
                    </div>

                    <div className="flex flex-col justify-between flex-1 text-left">
                        <h2
                            className={`text-[14px] font-bold line-clamp-1 overflow-hidden ${theme === "dark" ? "text-white" : "text-[#757575]"
                                }`}
                            title={cleanTitle}
                        >
                            {cleanTitle}
                        </h2>
                        <div className="flex justify-between flex-col gap-1 mt-1 absolute top-[27%]">
                            <div className="flex justify-start flex-nowrap gap-2">
                                {hasDiscount && (
                                    <span
                                        className={`text-[12px] flex line-through ${theme === "dark" ? "text-white" : "text-[#757575]"
                                            }`}
                                    >
                                        <span className="text-nowrap mr-0.5">
                                            <PriceIcon />
                                        </span>
                                        {Number(originalPrice).toLocaleString()}
                                    </span>
                                )}
                                <span className="text-[12px] text-[#ef5350] flex text-nowrap">
                                    <span className="text-nowrap mr-0.5">
                                        <PriceIcon />
                                    </span>
                                    {Number(discountedPrice).toLocaleString()}
                                </span>
                            </div>

                            <div
                                className={`flex justify-start text-nowrap gap-2 text-[12px] ${theme === "dark" ? "text-white" : "text-[#757575]"
                                    }`}
                            >
                                <span>حافظه: {storage}</span>
                                <span>رم: {ram}</span>
                            </div>
                        </div>

                        <button className="absolute bottom-0 right-0 w-[47px] h-[23px] bg-[#ef5350] text-white text-[10px] font-normal flex items-center justify-center rounded-tl-[24px] rounded-br-[24px] select-none">
                            <svg
                                id="Cart-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                            >
                                <g id="Cart-icon-background">
                                    <rect id="Cart-icon-box" width="24" height="24" rx="4" fill="none" />
                                </g>
                                <g id="Cart" transform="translate(2 2.013)">
                                    <path
                                        id="Cart-path"
                                        d="M17.857,6.644A.794.794,0,0,0,17.2,6.29H6.266L5.343,4.012A1.6,1.6,0,0,0,3.866,3H2V4.645H3.866l3.8,9.363a.8.8,0,0,0,.738.506h6.4a.8.8,0,0,0,.75-.533l2.4-6.579A.842.842,0,0,0,17.857,6.644Zm-3.612,6.225H8.933l-2-4.934h9.112Z"
                                        fill="#fff"
                                    />
                                    <circle
                                        id="Cart-wheel-left"
                                        cx="1"
                                        cy="1"
                                        r="1"
                                        transform="translate(7.632 15.4)"
                                        fill="#fff"
                                    />
                                    <circle
                                        id="Cart-wheel-right"
                                        cx="1"
                                        cy="1"
                                        r="1"
                                        transform="translate(13.263 15.4)"
                                        fill="#fff"
                                    />
                                </g>
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </article>
    );
}
