"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Children } from "react";

export default function BannerSwiper({ children }) {
    const childArray = Children.toArray(children);
    const slideStyle = { width: "240px" };

    return (
        <div className="w-full overflow-hidden">
            <Swiper
                slidesPerView="auto"
                centeredSlides={true}
                spaceBetween={35}
                loop={false}
                initialSlide={1}
                className="!overflow-visible"
            >
                {childArray.map((child, index) => (
                    <SwiperSlide key={`slide-${index}`} style={slideStyle}>
                        {child}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
