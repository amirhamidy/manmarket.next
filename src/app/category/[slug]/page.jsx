"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import ProductCard from "@/components/homeComponents/ProductCard";
import Navbar from "@/base/navbar";
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

const darkCategories = lightCategories.map(c => ({
    ...c,
    img: c.img.replace("/assets/img/", "/assets/img/dark-category/"),
}));

const BASE_URL = "https://api.manmarket.ir/product/v1";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.97, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15 } },
};

export default function CategoryBrandPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const segments = pathname?.split("/") ?? [];
    const categorySlug = segments[2] || "phone";
    const brandSlug = segments[3] || null;

    const [selectedCategory, setSelectedCategory] = useState(
        () => lightCategories.find(c => c.slug === categorySlug) ?? lightCategories[0]
    );
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dropdownCategoryOpen, setDropdownCategoryOpen] = useState(false);
    const [dropdownBrandOpen, setDropdownBrandOpen] = useState(false);

    const loaderRef = useRef(null);
    const observerRef = useRef(null);
    const fetchIdRef = useRef(0);
    const pageRef = useRef(1);

    useEffect(() => {
        AOS.init({ duration: 400, once: true, easing: "ease-out-cubic" });
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [products]);

    useEffect(() => {
        let cancelled = false;
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${BASE_URL}/brand/?category=${selectedCategory.slug}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (cancelled) return;
                const filtered = Array.isArray(data) ? data.filter(b => b?.image) : [];
                setBrands(filtered);
                if (brandSlug) {
                    setSelectedBrand(filtered.find(b => b.slug === brandSlug) ?? null);
                } else {
                    setSelectedBrand(null);
                }
            } catch {
                if (!cancelled) { setBrands([]); setSelectedBrand(null); }
            }
        };
        fetchBrands();
        return () => { cancelled = true; };
    }, [selectedCategory.slug, brandSlug]);

    const fetchProducts = useCallback(async (catSlug, brSlug, nextPage) => {
        const fetchId = ++fetchIdRef.current;
        setLoading(true);
        try {
            let url = `${BASE_URL}/product/?category=${catSlug}&page=${nextPage}`;
            if (brSlug) url += `&brand=${brSlug}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            const data = await res.json();
            if (fetchId !== fetchIdRef.current) return;
            const results = Array.isArray(data) ? data : (data?.results ?? []);
            const nextLink = Array.isArray(data) ? null : (data?.links?.next ?? null);
            setProducts(prev =>
                nextPage === 1
                    ? results
                    : [...prev, ...results.filter(p => !prev.some(e => e.id === p.id))]
            );
            pageRef.current = nextPage;
            setHasMore(Boolean(nextLink));
        } catch {
            if (fetchId === fetchIdRef.current) setHasMore(false);
        } finally {
            if (fetchId === fetchIdRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        setProducts([]);
        pageRef.current = 1;
        setHasMore(false);
        fetchProducts(selectedCategory.slug, selectedBrand?.slug ?? null, 1);
    }, [selectedCategory.slug, selectedBrand?.slug, fetchProducts]);

    useEffect(() => {
        if (!loaderRef.current) return;
        observerRef.current?.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                fetchProducts(selectedCategory.slug, selectedBrand?.slug ?? null, pageRef.current + 1);
            }
        }, { threshold: 0.5 });
        observerRef.current.observe(loaderRef.current);
        return () => observerRef.current?.disconnect();
    }, [hasMore, loading, selectedCategory.slug, selectedBrand?.slug, fetchProducts]);

    const handleCategorySelect = cat => {
        if (cat.slug === selectedCategory.slug) { setDropdownCategoryOpen(false); return; }
        setSelectedCategory(cat);
        setSelectedBrand(null);
        setDropdownCategoryOpen(false);
        router.push(`/category/${cat.slug}`);
    };

    const handleBrandSelect = brand => {
        if (brand?.slug === selectedBrand?.slug) { setDropdownBrandOpen(false); return; }
        setSelectedBrand(brand);
        setDropdownBrandOpen(false);
        router.push(`/category/${selectedCategory.slug}/${brand.slug}`);
    };

    const handleClearBrand = () => {
        setSelectedBrand(null);
        router.push(`/category/${selectedCategory.slug}`);
    };

    const categories = theme === "dark" ? darkCategories : lightCategories;
    const isDark = theme === "dark";

    return (
        <main
            dir="rtl"
            className={`w-full min-h-screen flex flex-col pb-24 items-center transition-colors duration-500 ${isDark ? "bg-[#0a0a0a] text-white/90" : "bg-[#fafafa] text-gray-900"
                }`}
        >
            {/* ── Filter Buttons ── */}
            <div className="w-full max-w-[556px] flex gap-3 px-4 mt-8 sticky top-4 z-40">
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDropdownCategoryOpen(true)}
                    className={`flex-1 h-12 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-medium transition-colors duration-200 ${isDark
                        ? "bg-white/[0.06] text-white/80"
                        : "bg-black/[0.03] text-gray-700"
                        }`}

                >
                    <span>{selectedCategory.name}</span>
                    :
                    <img src={selectedCategory.img} className="w-7 h-7 opacity-60" alt="" />
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDropdownBrandOpen(true)}
                    className={`flex-1 h-12 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-medium transition-colors duration-200 ${isDark
                        ? "bg-white/[0.06] text-white/80"
                        : "bg-black/[0.03] text-gray-700"
                        }`}
                >
                    {selectedBrand ? (
                        <>
                            برند :
                            <img src={selectedBrand.image} className="w-7 h-7 object-contain" alt="" />
                            <span className="truncate max-w-[100px]">{selectedBrand.name}</span>
                        </>
                    ) : (
                        <span className="opacity-50">همه برندها</span>
                    )}
                </motion.button>
            </div>

            {/* ── Category Dropdown ── */}
            <AnimatePresence>
                {dropdownCategoryOpen && (
                    <>
                        <motion.div
                            variants={overlayVariants}
                            initial="hidden" animate="visible" exit="exit"
                            onClick={() => setDropdownCategoryOpen(false)}
                            className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30"
                        />
                        <motion.div
                            variants={dropdownVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[480px] rounded-3xl p-6 ${isDark ? "bg-[#141414]" : "bg-white"
                                }`}
                        >
                            <div className="grid grid-cols-4 gap-3">
                                {categories.map(cat => (
                                    <motion.button
                                        key={cat.slug}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleCategorySelect(cat)}
                                        className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-opacity duration-200 ${selectedCategory.slug === cat.slug
                                            ? "opacity-100"
                                            : "opacity-35 hover:opacity-60"
                                            }`}
                                    >
                                        <img src={cat.img} className="w-7 h-7" alt="" />
                                        <span className="text-[10px]  m">{cat.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Brand Dropdown ── */}
            <AnimatePresence>
                {dropdownBrandOpen && (
                    <>
                        <motion.div
                            variants={overlayVariants}
                            initial="hidden" animate="visible" exit="exit"
                            onClick={() => setDropdownBrandOpen(false)}
                            className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30"
                        />
                        <motion.div
                            variants={dropdownVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[480px] max-h-[55vh] overflow-y-auto hide-scrollbar rounded-3xl p-6 ${isDark ? "bg-[#141414]" : "bg-white"
                                }`}
                        >
                            <div className="grid grid-cols-3 gap-3">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClearBrand}
                                    className={`flex items-center justify-center py-3 px-2 rounded-2xl text-[11px] font-medium transition-opacity duration-200 ${!selectedBrand ? "opacity-100" : "opacity-35 hover:opacity-60"
                                        }`}
                                >
                                    همه برندها
                                </motion.button>
                                {brands.map(brand => (
                                    <motion.button
                                        key={brand.id}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleBrandSelect(brand)}
                                        className={`flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl transition-opacity duration-200 ${brand.slug === selectedBrand?.slug
                                            ? "opacity-100"
                                            : "opacity-35 hover:opacity-60"
                                            }`}
                                    >
                                        <img src={brand.image} className="w-9 h-9 object-contain" alt="" />
                                        <span className="text-[10px] font-medium">{brand.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Products Grid ── */}
            <div className="w-full max-w-[556px] grid grid-cols-2 gap-3 mt-6 px-4">
                {!loading && products.length === 0 && (
                    <div className="col-span-2 text-center py-16 text-sm opacity-40">
                        محصولی یافت نشد
                    </div>
                )}

                {products.map((product, index) => (
                    <div
                        key={`${product.slug}-${index}`}
                        data-aos="fade-up"
                        data-aos-delay={Math.min((index % 6) * 50, 250)}
                    >
                        <ProductCard product={product} theme={theme} />
                    </div>
                ))}

                {loading && Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-40 rounded-2xl animate-pulse ${isDark ? "bg-white/[0.04]" : "bg-black/[0.03]"}`}
                    />
                ))}

                <div ref={loaderRef} className="col-span-2 h-1" />
            </div>

            <Navbar />
        </main>
    );
}
