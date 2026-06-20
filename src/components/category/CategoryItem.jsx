"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import { useEffect, useState } from "react";

function CategoryItemSkeleton() {
    return (
        <div className="w-full h-16 rounded-[24px] bg-gray-200 flex items-center justify-between my-2 px-4 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
            </div>
        </div>
    );
}

export default function CategoryItem({ name, img, onClick }) {
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <CategoryItemSkeleton />;
    }

    return (
        <button
            onClick={onClick}
            className={` w-full h-16 rounded-[24px]  ${theme === "dark" ? "bg-[#23262B] " : "bg-[#ff7643]"}  flex items-center justify-between my-2 px-4 transition-all duration-200 active:scale-[0.98] `}
            aria-label={`دسته بندی ${name}`}
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                        src={img}
                        alt={name}
                        width={32}
                        height={32}
                        priority={false}
                    />
                </div>
                <span className={` text-[14px] ${theme === "dark" ? "text-[#ff7643]" : "text-[white]"}`}>{name}</span>
            </div>
        </button>
    );
}
