"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PriceIcon from "../icons/priceIcon";
import { useTheme } from "@/context/ThemeContext";
import HeartButton from "../HeartButton";
import { useLike } from "@/hook/useLike";

export default function ProductCard({ product }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!product) return null;

    const { liked, loading: likeLoading, toggle } = useLike(product.id);

    const displayTitle = product.brief_title || product.title || product.englishName || product.product_slug?.replaceAll('-', ' ') || "Product";

    return (
        <Link href={product.slug ? `/product/item/${product.slug}` : '#'} className="block w-full">
            <article
                className={`w-full relative rounded-xl overflow-hidden
                flex flex-col items-center text-right py-2 px-2
                shadow-[0_8px_16px_rgba(255,118,67,0.043)]
                transition-colors duration-300
                ${theme === "dark" ? "bg-[#23262b]" : "bg-white"}`}
                itemScope
                itemType="http://schema.org/Product"
            >
                {loading ? (
                    <>
                        <div className={`w-full h-[120px] rounded-xl ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`} />
                        <div className={`mt-3 h-4 w-3/4 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`} />
                        <div className={`mt-2 h-4 w-1/3 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`} />
                    </>
                ) : (
                    <>
                        {product.has_discount && (
                            <span className="absolute top-0 left-0 w-[43px] h-[27px] bg-[#ef5350] text-white text-[10px] flex items-center justify-center rounded-tl-[24px] rounded-br-[24px] select-none">
                                10%
                            </span>
                        )}

                        <div className="w-full flex justify-center items-center relative">
                            <img
                                src={product.image || "/assets/img/placeholder.webp"}
                                alt={displayTitle}
                                title={displayTitle}
                                className="w-full h-[170px] object-contain rounded-xl"
                                loading="lazy"
                                itemProp="image"
                            />

                            <button
                                onClickCapture={toggle}
                                className="absolute top-1 right-0 w-6 h-6 flex items-center justify-center cursor-pointer pointer-events-auto z-10"
                                aria-label={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                            >
                                <HeartButton liked={liked} loading={likeLoading} />
                            </button>
                        </div>

                        <h2
                            dir="ltr"
                            className={`text-[13px] text-start font-bold line-clamp-2 ${theme === "dark" ? "text-white" : "text-[#757575]"}`}
                            title={displayTitle}
                            itemProp="name"
                        >
                            {displayTitle}
                        </h2>

                        <div className="flex items-center justify-between w-full mt-2">
                            <div className="flex items-center">
                                <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M13.969,6.308a.6.6,0,0,0-.521-.406L10.027,5.63,8.547,2.353a.6.6,0,0,0-1.093,0L5.974,5.63,2.553,5.9A.6.6,0,0,0,2.181,6.93L4.709,9.394l-.894,3.871a.6.6,0,0,0,.918.634L8,11.722,11.268,13.9a.6.6,0,0,0,.91-.664L11.08,9.4,13.8,6.947A.6.6,0,0,0,13.969,6.308Z" fill="#ff7643" />
                                </svg>
                                <span className="text-[#ff7643] text-[13px] mr-0.5" itemProp="aggregateRating" itemScope itemType="http://schema.org/AggregateRating">
                                    {product.avg_rate ? product.avg_rate.toFixed(1) : "0.0"}
                                    <meta itemProp="ratingValue" content={String(product.avg_rate || 0)} />
                                    <meta itemProp="bestRating" content="5" />
                                    <meta itemProp="worstRating" content="1" />
                                </span>
                            </div>

                            <span className="text-[#ef5350] text-[13px]" itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                <div className="flex gap-0.5 items-center whitespace-nowrap">
                                    {typeof product.min_price === "number" ? product.min_price.toLocaleString() : product.min_price || "0"}
                                    <PriceIcon />
                                    <meta itemProp="price" content={String(product.min_price || 0)} />
                                    <meta itemProp="priceCurrency" content="IRR" />
                                </div>
                            </span>
                        </div>
                    </>
                )}
            </article>
        </Link>
    );
}
