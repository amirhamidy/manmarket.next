"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

const ALLOWED_BRANDS = ["apple", "samsung", "xiaomi"];

export default function BrandGrid({ categorySlug, isOpen, onSelect }) {
    const { theme } = useTheme();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || brands.length) return;

        setLoading(true);
        fetch("https://api.manmarket.ir/product/v1/brand/")
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter(
                    b =>
                        b.image &&
                        ALLOWED_BRANDS.includes(b.slug.toLowerCase())
                );

                setBrands(filtered.slice(0, 3));
            })
            .finally(() => setLoading(false));
    }, [isOpen]);

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                >
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <BrandCard
                            title="همه"
                            theme={theme}
                            onClick={() =>
                                onSelect({ category: categorySlug })
                            }
                        />

                        {brands.map(brand => (
                            <BrandCard
                                key={brand.id}
                                title={brand.title}
                                img={brand.image}
                                theme={theme}
                                onClick={() =>
                                    onSelect({
                                        category: categorySlug,
                                        brand: brand.slug,
                                    })
                                }
                            />
                        ))}

                        {loading &&
                            Array.from({ length: 3 }).map((_, i) => (
                                <SkeletonCard key={i} theme={theme} />
                            ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function BrandCard({ title, img, onClick, theme }) {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-xl py-4 px-2 flex flex-col items-center gap-2
            shadow-[0_8px_16px_rgba(255,118,67,0.04)]
            transition-all active:scale-[0.98]
            ${theme === "dark" ? "bg-[#23262b]" : "bg-white"}`}
        >
            {img ? (
                <Image
                    src={img}
                    alt={title}
                    width={64}
                    height={64}
                    className="object-contain"
                />
            ) : (
                <div className="w-16 h-16 rounded-full bg-[#ff7643] text-white flex items-center justify-center text-sm">
                    {title}
                </div>
            )}
            <span className="text-[13px] font-bold text-[#ff7643]">
                {title}
            </span>
        </button>
    );
}

function SkeletonCard({ theme }) {
    return (
        <div
            className={`w-full h-[140px] rounded-xl animate-pulse
            ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
        />
    );
}
