"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryItem from "@/components/category/CategoryItem";
import Navbar from "@/base/navbar";

const lightCategories = [
    { name: "موبایل", slug: "phone", img: "/assets/img/mobile.svg" },
    { name: "تبلت", slug: "tablet", img: "/assets/img/tablet.svg" },
    { name: "لپ تاپ", slug: "laptop", img: "/assets/img/laptop.svg" },
    { name: "مانیتور", slug: "monitor", img: "/assets/img/monitor.svg" },
    { name: "کنسول بازی", slug: "game-console", img: "/assets/img/game.svg" },
    { name: "اسپیکر", slug: "speaker", img: "/assets/img/speaker.svg" },
    { name: "هدفون", slug: "headset-headphones", img: "/assets/img/headphone.svg" },
    { name: "ساعت هوشمند", slug: "smartwatch", img: "/assets/img/applewatch.svg" },
];

const darkCategories = lightCategories.map(c => ({
    ...c,
    img: c.img.replace("/assets/img/", "/assets/img/dark-category/")
}));

const ALLOWED_BRANDS = ["apple", "samsung", "xiaomi"];

export default function CategoryList() {
    const { theme } = useTheme();
    const router = useRouter();
    const categories = theme === "dark" ? darkCategories : lightCategories;
    const [activeCategory, setActiveCategory] = useState(null);
    const [brands, setBrands] = useState({});
    const [loading, setLoading] = useState({});

    const fetchBrands = async slug => {
        if (brands[slug]) return;
        setLoading(p => ({ ...p, [slug]: true }));
        const res = await fetch("https://api.manmarket.ir/product/v1/brand/");
        const data = await res.json();
        const filtered = data.filter(
            b => b.image && ALLOWED_BRANDS.includes(b.slug.toLowerCase())
        );
        setBrands(p => ({ ...p, [slug]: filtered }));
        setLoading(p => ({ ...p, [slug]: false }));
    };

    return (
        <section className={`w-full max-w-[556px] mx-auto pb-16 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
            <CategoryHeader />

            <section className="mt-3 space-y-2">
                {categories.map(cat => (
                    <div key={cat.slug}>
                        <CategoryItem
                            name={cat.name}
                            img={cat.img}
                            onClick={() => {
                                setActiveCategory(p => p === cat.slug ? null : cat.slug);
                                fetchBrands(cat.slug);
                            }}
                        />

                        <AnimatePresence initial={false}>
                            {activeCategory === cat.slug && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                        {brands[cat.slug]?.map(brand => (
                                            <BrandCard
                                                key={brand.id}
                                                img={brand.image}
                                                title={brand.title}
                                                theme={theme}
                                                onClick={() =>
                                                    router.push(`/category/${cat.slug}/${brand.slug}`)
                                                }
                                            />
                                        ))}

                                        <BrandCard
                                            title="همه برندها"
                                            theme={theme}
                                            onClick={() =>
                                                router.push(`/category/${cat.slug}`)
                                            }
                                        />

                                        {loading[cat.slug] &&
                                            Array.from({ length: 3 }).map((_, i) => (
                                                <SkeletonCard key={i} theme={theme} />
                                            ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </section>

            <Navbar />
        </section>
    );
}

function BrandCard({ title, img, onClick, theme }) {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-xl py-4 flex flex-col items-center flex justify-center gap-2 active:scale-[0.98] shadow ${theme === "dark" ? "bg-[#23262b]" : "bg-white"}`}
        >
            {img && <img src={img} className="w-16 h-16 object-contain" />}
            <span className="text-sm font-bold  text-[#ff7643]">{title}</span>
        </button>
    );
}

function SkeletonCard({ theme }) {
    return (
        <div className={`w-full h-[140px] rounded-xl animate-pulse ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
    );
}