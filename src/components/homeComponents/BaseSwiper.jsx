"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules"; 
import ProductCardSEO from "@/components/homeComponents/ProductCardSEO";
import ProductCardSEOv3 from "@/components/homeComponents/ProductCardSEOv3";

export default function BaseSwiper({ items, type }) {
    if (!items || !items.length) return null;

    return (
        <Swiper
            slidesPerView="auto"
            spaceBetween={12}
            freeMode={true}
            grabCursor={true}
            modules={[FreeMode]}
            className="py-3"
        >
            {items.map((item) => (
                <SwiperSlide key={item.id} className="!w-auto">
                    {type === "v2" ? (
                        <ProductCardSEO product={{
                            id: item.id,
                            title: item.title,
                            brief_title: item.brief_title,
                            image: item.image,
                            min_price: item.min_price,
                            avg_rate: item.avg_rate,
                            has_discount: item.has_discount,
                            specifications: item.specifications
                        }} />
                    ) : (
                        <ProductCardSEOv3 product={item} />
                    )}
                </SwiperSlide>
            ))}
        </Swiper>
    );
}