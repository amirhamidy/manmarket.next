"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CategoryCard from "./CategoryCard";
import RightIcon from "../icons/rightIcon";

export default function CategoryCarousel({ lightCategories, darkCategories }) {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(t);
    }, []);

    const categories = theme === "dark" ? darkCategories : lightCategories;

    return (
        <>
            <div className="flex justify-between max-w-full h-6 px-4 mt-4 text-[#ff7643] font-bold">
                <span className="text-[13px]">دسته بندی ها</span>
                <Link href="category" className="flex items-center">
                    <span className="text-[13px] mx-1">دیدن همه</span>
                    <span className="rotate-180">
                        <RightIcon />
                    </span>
                </Link>
            </div>

            <div className="w-full mt-2">
                {loading ? (
                    <div className="flex gap-4 py-4 px-3.5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className={`shrink-0 w-16 h-16 rounded-xl animate-pulse ${theme === "dark"
                                        ? "bg-[#23262B]"
                                        : "bg-[#fff7f4]"
                                    }`}
                            />
                        ))}
                    </div>
                ) : (
                    <Swiper
                        slidesPerView="auto"
                        spaceBetween={16}
                        resistanceRatio={0}
                        grabCursor
                        className="px-3.5 py-4"
                    >
                        {categories.map((cat) => (
                            <SwiperSlide key={cat.name} className="!w-auto">
                                <CategoryCard category={cat} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </>
    );
}