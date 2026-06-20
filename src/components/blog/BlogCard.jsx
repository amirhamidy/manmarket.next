"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function BlogCard({ blogs = [] }) {
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".blog-card")) setActiveCard(null);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="w-full my-3">
            <Swiper spaceBetween={8} slidesPerView="auto" resistanceRatio={0} grabCursor className="px-3">
                {blogs.map((blog) => (
                    <SwiperSlide key={blog.id} className="!w-[157px]">
                        <div
                            className="blog-card relative w-[157px] h-[220px] rounded-3xl overflow-hidden cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveCard(activeCard === blog.id ? null : blog.id);
                            }}
                        >
                            <img
                                src={blog.image}
                                alt=""
                                className={`w-full h-full object-cover transition duration-300 ${activeCard === blog.id ? "brightness-125" : ""}`}
                            />
                            <div className={`absolute inset-0 flex justify-center items-center text-center transition-opacity duration-300 ${activeCard === blog.id ? "bg-white/90 opacity-100" : "opacity-0"}`}>
                                <span className="text-gray-800 font-bold text-[14px] px-2">{blog.title}</span>
                            </div>
                            <Link
                                href={`/blog/${blog.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className={`absolute bottom-0 right-0 w-10 h-10 rounded-tl-3xl flex justify-center items-center bg-[#ededed] transition-opacity duration-300 ${activeCard === blog.id ? "opacity-100" : "opacity-0"}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
