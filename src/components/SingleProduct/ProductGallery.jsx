"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import ProductStatsBadge from "./ProductStatsBadge";

export default function ProductGallery({
    images = [],
    stats,
    index,
    onChangeIndex,
    onOpen,
}) {
    const [fade, setFade] = useState(false);
    const [startX, setStartX] = useState(null);
    const { theme } = useTheme();

    const isLoading = !images || images.length === 0;

    const changeImageWithFade = (newIndex) => {
        setFade(true);
        setTimeout(() => {
            onChangeIndex(newIndex);
            setFade(false);
        }, 200);
    };

    const next = () => changeImageWithFade((index + 1) % images.length);
    const prev = () => changeImageWithFade((index - 1 + images.length) % images.length);

    const handleStart = (x) => setStartX(x);

    const handleEnd = (x) => {
        if (startX === null) return;
        const diff = startX - x;
        if (diff > 60) next();
        if (diff < -60) prev();
        setStartX(null);
    };

    if (isLoading) {
        return (
            <div className="relative w-full h-[300px] mb-6">
                <div
                    className="w-full h-full rounded-xl animate-pulse"
                    style={{ backgroundColor: theme === "dark" ? "#2c2f35" : "#ededed" }}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="w-10 h-10 rounded-lg animate-pulse"
                            style={{ backgroundColor: theme === "dark" ? "#2c2f35" : "#ededed" }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative w-full h-[300px] mb-6 select-none"
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseUp={(e) => handleEnd(e.clientX)}
        >
            <img
                src={images[index]}
                onClick={onOpen}
                alt="تصویر محصول"
                className={`w-full h-full object-contain transition-opacity duration-200 ${fade ? "opacity-50" : "opacity-100"}`}
                style={{ backgroundColor: theme === "dark" ? "#23262B" : "white" }}
                draggable={false}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {images.slice(0, 5).map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => changeImageWithFade(idx)}
                        className={`w-10 h-10 rounded-lg border-2 overflow-hidden transition ${index === idx ? "border-[#ff7643]" : "border-gray-200"}`}
                    >
                        <img
                            src={img}
                            className="w-full h-full object-contain"
                            draggable={false}
                        />
                    </button>
                ))}
            </div>

            <div className="z-[99999999]">
                {stats && <ProductStatsBadge stats={stats} />}
            </div>
        </div>
    );
}