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

const categoryBrandMapping = {
    phone: ["apple", "samsung", "xiaomi", ],
    tablet: ["apple", "samsung", "xiaomi", ],
    laptop: ["apple", "asus", "acer", "lenovo", "hp", "msi", "dell", "xiaomi", "huawei"],
    monitor: ["asus", "acer", "lenovo", "msi", "hp", "dell"],
    "game-console": ["sony", "microsoft"],
    speaker: ["jbl", "sony", "anker"],
    "headset-headphones": ["jbl", "sony", "anker", "apple", "beats", "qcy"],
    smartwatch: ["apple", "samsung", "xiaomi", "huawei", "mibro", "haylou"],
};

export default function CategoryList() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === "dark";
    const categories = isDark ? darkCategories : lightCategories;
    const [activeCategory, setActiveCategory] = useState(null);
    const [brands, setBrands] = useState({});
    const [loading, setLoading] = useState({});

    const fetchBrands = async slug => {
        if (brands[slug]) return;
        setLoading(p => ({ ...p, [slug]: true }));
        try {
            const res = await fetch("https://api.manmarket.ir/product/v1/brand/");
            const data = await res.json();
            const allowedSlugs = categoryBrandMapping[slug] || [];
            const filtered = data.filter(
                b => b.image && allowedSlugs.includes(b.slug.toLowerCase())
            ).slice(0, 3);
            setBrands(p => ({ ...p, [slug]: filtered }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(p => ({ ...p, [slug]: false }));
        }
    };

    return (
        <section className={`w-full max-w-[556px] mx-auto pb-16 min-h-screen ${isDark ? "bg-[#0a0a0a]" : ""}`}>
            <CategoryHeader />
            <section className="mt-3 space-y-2 px-4">
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
                                    <div className="grid grid-cols-2 gap-3 mt-3 mb-4">
                                        {brands[cat.slug]?.map(brand => (
                                            <BrandCard
                                                key={brand.id}
                                                img={brand.image}
                                                title={brand.name}
                                                theme={theme}
                                                onClick={() => router.push(`/category/${cat.slug}/${brand.slug}`)}
                                            />
                                        ))}
                                        {!loading[cat.slug] && (
                                            <BrandCard
                                                title="همه برندها"
                                                theme={theme}
                                                isAll={true}
                                                onClick={() => router.push(`/category/${cat.slug}`)}
                                            />
                                        )}
                                        {loading[cat.slug] &&
                                            Array.from({ length: 4 }).map((_, i) => (
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

function BrandCard({ title, img, onClick, theme, isAll }) {
    const isDark = theme === "dark";
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-2xl py-5 flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-sm ${isDark ? "bg-[#141414] text-white/90" : "bg-white text-gray-900"}`}
        >
            {img ? (
                <img src={img} className={`w-10 h-10 object-contain ${isDark ? "brightness-200" : ""}`} alt={title} />
            ) : isAll ? (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff7643]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff7643" strokeWidth="2.5">
                        <path d="M4 12h16m-8-8v16" />
                    </svg>
                </div>
            ) : null}
            <span className={`text-xs font-bold ${isAll ? "text-[#ff7643]" : ""}`}>{title}</span>
        </button>
    );
}

function SkeletonCard({ theme }) {
    return (
        <div className={`w-full h-[120px] rounded-2xl animate-pulse ${theme === "dark" ? "bg-white/[0.05]" : "bg-black/[0.05]"}`} />
    );
}
