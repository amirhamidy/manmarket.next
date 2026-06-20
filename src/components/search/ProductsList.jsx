"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PriceIcon from "../icons/priceIcon";
import { useTheme } from "@/context/ThemeContext";

const lightCategories = [
    { name: "موبایل", img: "/assets/img/mobile.svg", slug: "phone" },
    { name: "تبلت", img: "/assets/img/tablet.svg", slug: "tablet" },
    { name: "لپ تاپ", img: "/assets/img/laptop.svg", slug: "laptop" },
    { name: "مانیتور", img: "/assets/img/monitor.svg", slug: "monitor" },
    { name: "کنسول بازی", img: "/assets/img/game.svg", slug: "game-console" },
    { name: "اسپیکر", img: "/assets/img/speaker.svg", slug: "speaker" },
    { name: "هدفون", img: "/assets/img/headphone.svg", slug: "headset-headphones" },
    { name: "ساعت هوشمند", img: "/assets/img/applewatch.svg", slug: "smartwatch" },
];

const darkCategories = lightCategories.map(cat => ({
    ...cat,
    img: cat.img.replace("/assets/img/", "/assets/img/dark-category/")
}));

export default function CategoryProductPage() {
    const { theme } = useTheme();
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef();
    const [selectedCategory, setSelectedCategory] = useState(lightCategories[0]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const categoryRef = useRef();
    const brandRef = useRef();
    const [dropdownCategoryOpen, setDropdownCategoryOpen] = useState(false);
    const [dropdownBrandOpen, setDropdownBrandOpen] = useState(false);

    useEffect(() => {
        fetchBrands();
        setProducts([]);
        setPage(1);
        setHasMore(true);
        fetchProducts(lightCategories[0].slug, 1);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 0.5 });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [products, hasMore]);

    useEffect(() => {
        const handler = (e) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) setDropdownCategoryOpen(false);
            if (brandRef.current && !brandRef.current.contains(e.target)) setDropdownBrandOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchBrands = async () => {
        try {
            const res = await fetch("https://api.manmarket.ir/product/v1/brand/");
            const data = await res.json();
            const filtered = data.filter(b => b.image);
            setBrands(filtered);
            if (!selectedBrand && filtered.length) setSelectedBrand(filtered[0]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) fetchProducts(selectedCategory.slug, page + 1);
    };

    const fetchProducts = async (categorySlug, nextPage) => {
        setLoading(true);
        try {
            const res = await fetch(`https://api.manmarket.ir/product/v1/product/?page=${nextPage}`);
            const data = await res.json();
            const filtered = data.results.filter(p => p.category?.slug === categorySlug);
            const uniqueFiltered = filtered.filter(p => !products.some(existing => existing.id === p.id));
            setProducts(prev => [...prev, ...uniqueFiltered]);
            setPage(nextPage);
            setHasMore(data.links.next !== null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        setDropdownCategoryOpen(false);
        setProducts([]);
        setPage(1);
        setHasMore(true);
        fetchProducts(cat.slug, 1);
    };

    const handleBrandSelect = (brand) => {
        setSelectedBrand(brand);
        setDropdownBrandOpen(false);
    };

    return (
        <main className={`w-full min-h-screen flex flex-col items-center ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            <div className="w-full max-w-[556px] flex gap-3 px-3 mt-3">
                <div className="flex gap-3 mx-1 flex-shrink-0 ">
                    <div ref={categoryRef} className="relative">
                        <motion.button
                            onClick={() => setDropdownCategoryOpen(v => !v)}
                            whileTap={{ scale: 0.98 }}
                            className={`w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer ${theme === "dark" ? "drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-[#23262B]" : "bg-white"} shadow-[0_1px_4px_rgba(0,0,0,0.12)] ${theme === "dark" ? "bg-[#23262B]" : "bg-[#fff7f4]"} `}
                        >
                            <img src={selectedCategory.img} alt={selectedCategory.name} className="w-10 h-10 object-contain" />
                        </motion.button>
                        <AnimatePresence>
                            {dropdownCategoryOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`absolute top-full w-[200px] left-[-100%] mt-2 flex flex-wrap items-center justify-center space-y-2 gap-0.5 p-4 rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.12)] z-[100] ${theme === "dark" ? "bg-[#1f2023]" : "bg-white"}`}
                                >
                                    {(theme === "dark" ? darkCategories : lightCategories).map(cat => (
                                        <button
                                            key={`cat-drop-${cat.slug}`}
                                            onClick={() => handleCategorySelect(cat)}
                                            className={`flex-shrink-0 w-[49%] h-16 rounded-xl flex flex-col items-center justify-center text-center py-2 transition-colors duration-300 cursor-pointer ${theme === "dark" ? "bg-[#23262B]" : "bg-[#fff7f4]"}`}
                                        >
                                            <img src={cat.img} alt={cat.name} className="w-9 h-9 object-contain" />
                                            <span className="text-[9px] text-[#ff7643] font-extrabold m-1.5">
                                                {cat.name}
                                            </span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex gap-3 mx-1 flex-shrink-0 ">
                    <div ref={brandRef} className="relative">
                        <motion.button
                            onClick={() => setDropdownBrandOpen(v => !v)}
                            whileTap={{ scale: 0.98 }}
                            className={`w-16 h-16 rounded-xl flex items-center justify-center cursor-pointer ${theme === "dark" ? "drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-[#23262B]" : "bg-white"} shadow-[0_1px_4px_rgba(0,0,0,0.12)]`}
                        >
                            <img src={selectedBrand?.image} alt={selectedBrand?.title} className="w-10 h-10 object-contain" />
                        </motion.button>
                        <AnimatePresence>
                            {dropdownBrandOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`absolute w-[240px] top-full left[-220%]  mt-2 flex flex-wrap items-center p-1 rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.12)] z-[100] ${theme === "dark" ? "bg-[#1f2023]" : "bg-white"}`}
                                >
                                    {brands.map(brand => (
                                        <button
                                            key={`brand-drop-${brand.id}`}
                                            onClick={() => handleBrandSelect(brand)}
                                            className={`w-[50%] h-[100%] my-1 py-2 rounded-lg flex items-center justify-center transition-all duration-200 ${theme === "dark" ? "hover:bg-[#2a2d32]" : "hover:bg-gray-50"}`}
                                        >
                                            <img src={brand.image} alt={brand.title} className="w-12  object-contain" />
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[556px] grid grid-cols-2 gap-3 mt-3 px-3">
                {products.map((product, index) => (
                    <ProductCard
                        key={`product-${product.slug}-${index}`}
                        product={product}
                        theme={theme}
                    />
                ))}
                {loading &&
                    Array.from({ length: 10 }).map((_, i) => (
                        <div key={`loading-${i}`} className={`w-full relative rounded-xl overflow-hidden flex flex-col items-center text-right py-3 px-2 shadow-[0_8px_16px_rgba(255,118,67,0.043)] transition-colors duration-300 ${theme === "dark" ? "bg-[#23262b]" : "bg-white"}`}>
                            <div className={`w-full h-[120px] rounded-xl ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`} />
                            <div className={`mt-3 h-4 w-3/4 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`} />
                            <div className={`flex justify-start items-center gap-2 mt-2 h-4 w-1/3 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`} />
                        </div>
                    ))
                }
                <div ref={loaderRef} className="col-span-2 w-full h-1" />
            </div>
        </main>
    );
}

function ProductCard({ product, theme }) {
    const cleanTitle = product.brief_title || product.title;
    return (
        <Link href={`/product/item/${product.slug}`} className="block w-full">
            <article className={`w-full relative rounded-xl overflow-hidden flex flex-col items-center text-right py-3 px-2 shadow-[0_8px_16px_rgba(255,118,67,0.043)] transition-colors duration-300 ${theme === "dark" ? "bg-[#23262b]" : "bg-white"}`}>
                {product.has_discount && (
                    <span className="absolute top-0 left-0 w-[43px] h-[27px] bg-[#ef5350] text-white text-[10px] font-normal flex items-center justify-center rounded-tl-[24px] rounded-br-[24px] select-none">10%</span>
                )}
                <div className="w-full flex justify-center h-[120px] relative">
                    <img src={product.image || "/assets/img/placeholder.webp"} alt={cleanTitle} className="w-full object-contain rounded-xl" />
                </div>
                <h2 dir="rtl" className={`mt-3 text-[13px] text-start font-bold line-clamp-2 ${theme === "dark" ? "text-white" : "text-[#757575]"}`}>{cleanTitle}</h2>
                <div className="flex items-center justify-between w-full mt-2">
                    <span className="text-[#ef5350] text-[13px]">
                        <div className="flex justify-center gap-0.5 items-center whitespace-nowrap">
                            {typeof product.min_price === "number" ? product.min_price.toLocaleString() : product.min_price || "0"}
                            <PriceIcon className="w-4 h-4" />
                        </div>
                    </span>
                    <div className="flex items-center">
                        <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M13.969,6.308a.6.6,0,0,0-.521-.406L10.027,5.63,8.547,2.353a.6.6,0,0,0-1.093,0L5.974,5.63,2.553,5.9A.6.6,0,0,0,2.181,6.93L4.709,9.394l-.894,3.871a.6.6,0,0,0,.918.634L8,11.722,11.268,13.9a.6.6,0,0,0,.91-.664L11.08,9.4,13.8,6.947A.6.6,0,0,0,13.969,6.308Z" fill="#ff7643" />
                        </svg>
                        <span className="text-[#ff7643] text-[13px] mr-0.5">{product.avg_rate ? product.avg_rate.toFixed(1) : "0.0"}</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}