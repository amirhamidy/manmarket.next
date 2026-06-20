"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import PriceIcon from "../icons/priceIcon";
import HeartButton from "../HeartButton";
import { useLike } from "@/hook/useLike";

export default function ProductCardSEOv3ClientWrapper({ product }) {
  const { theme } = useTheme();
  const { liked, loading: likeLoading, toggle } = useLike(product?.id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!product || !product.slug) return null;

  const hasDiscount = product.has_discount;
  const price = product.min_discounted_price ?? product.min_price ?? 0;
  const rating = product.avg_rate ?? 0;
  const discountPercent =
    hasDiscount && product.min_price
      ? Math.round(
          ((product.min_price - product.min_discounted_price) /
            product.min_price) *
            100,
        )
      : null;
  const textColor = theme === "dark" ? "text-white" : "text-[#757575]";

  return (
    <Link href={`/product/item/${product.slug}`} className="no-underline">
      <article
        dir="ltr"
        className={`w-[157px] rounded-[24px] shadow-[0_8px_16px_rgba(0,0,0,0.04)]
                flex flex-col items-center overflow-hidden p-2 relative transition-colors duration-300
                ${theme === "dark" ? "bg-[#23262b]" : "bg-white"}`}
        itemScope
        itemType="http://schema.org/Product"
      >
        {loading ? (
          <>
            <div
              className={`w-[157px] h-[220px] rounded-[24px] ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`}
            />
            <div
              className={`mt-2 h-4 w-11/12 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`}
            />
            <div
              className={`mt-1 h-3 w-1/2 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`}
            />
          </>
        ) : (
          <>
            {hasDiscount && discountPercent && (
              <span className="absolute top-0 left-0 w-[43px] h-[27px] bg-[#ef5350] text-white text-[10px] flex items-center justify-center rounded-tl-[24px] rounded-br-[24px]">
                {discountPercent}%
              </span>
            )}

            <div className="w-[157px] h-[220px] flex justify-center items-center relative">
              <img
                src={product.image || "/assets/img/placeholder.webp"}
                alt={product.title || product.brief_title}
                title={product.brief_title || product.title}
                className="w-full h-full object-contain rounded-[24px]"
                loading="lazy"
                itemProp="image"
              />

              <button
                onClick={toggle}
                className="absolute top-3 right-3 z-20 swiper-no-swiping pointer-events-auto flex items-center justify-center"
                aria-label={
                  liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
                }
              >
                <HeartButton liked={liked} loading={likeLoading} />
              </button>
            </div>

            <h2
              className={`mt-2 text-[13px] font-normal line-clamp-1 text-start w-full ${textColor}`}
              title={product.brief_title || product.title}
              itemProp="name"
            >
              {product.brief_title || product.title}
            </h2>

            <span
              dir="rtl"
              className={`text-[16px] flex justify-end items-center mt-1 w-full gap-0.5 ${textColor}`}
              itemProp="offers"
              itemScope
              itemType="http://schema.org/Offer"
            >
              <span>{price.toLocaleString()}</span>
              <PriceIcon />
              <meta itemProp="price" content={String(price)} />
              <meta itemProp="priceCurrency" content="IRR" />
            </span>

            <div className="flex items-center gap-1 mt-1 w-full">
              <span
                className="text-[#ff7643] text-[12px]"
                itemProp="aggregateRating"
                itemScope
                itemType="http://schema.org/AggregateRating"
              >
                {rating.toFixed(1)}
                <meta itemProp="ratingValue" content={String(rating)} />
                <meta itemProp="bestRating" content="5" />
                <meta itemProp="worstRating" content="1" />
              </span>

              <svg
                className="w-3.5 h-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M13.969,6.308a.6.6,0,0,0-.521-.406L10.027,5.63,8.547,2.353a.6.6,0,0,0-1.093,0L5.974,5.63,2.553,5.9A.6.6,0,0,0,2.181,6.93L4.709,9.394l-.894,3.871a.6.6,0,0,0,.918.634L8,11.722,11.268,13.9a.6.6,0,0,0,.91-.664L11.08,9.4,13.8,6.947A.6.6,0,0,0,13.969,6.308Z"
                  fill="#ff7643"
                />
              </svg>
            </div>
          </>
        )}
      </article>
    </Link>
  );
}
