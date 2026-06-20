"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainHeader from "@/base/mainHeader";
import { useTheme } from "@/context/ThemeContext";
import Navbar from "@/base/navbar";

export const FILTERS = {
    phone: ["RAM", "حافظه", "دوربین"],
    tablet: ["حافظه", "RAM", "اندازه صفحه نمایش"],
    laptop: ["برند", "CPU", "RAM", "GPU"],
    monitor: ["برند", "وضوح", "سایز صفحه نمایش"],
    "game-console": ["برند", "ظرفیت حافظه", "ریجن"],
    speaker: ["نوع اتصال", "توان خروجی", "قابل حمل"],
    "headset-headphones": ["نوع اتصال", "برند", "نویز کنسلینگ"],
    smartwatch: ["نوع کاربری", "سازگاری", "برند"],
};

function FilterScreenSkeleton({ theme }) {
    return (
        <section
            className={`max-w-[556px] mx-auto flex flex-col min-h-screen animate-pulse
            ${theme === "dark" ? "bg-[#121212]" : "bg-white"}`}
        >
            <div className="flex-1 px-5">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-12 rounded-full my-4
                        ${theme === "dark" ? "bg-[#1e1f24]" : "bg-gray-200"}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default function FilterScreen() {
    const { theme } = useTheme();

    const [search, setSearch] = useState("");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const [loading, setLoading] = useState(true);
    const [priceRange] = useState({ min: 0, max: 1000 });

    const sortOptions = [
        "پر فروش ترین",
        "بیشترین تخفیف",
        "بیشترین قیمت",
        "کمترین قیمت",
    ];

    useEffect(() => {
        fetch("https://api.manmarket.ir/product/v1/category/")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data.filter((item) => item.image));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filterTabs = useMemo(() => {
        if (!selectedCategory) return [];
        return (
            FILTERS[selectedCategory.slug]?.map((item) => ({
                key: item,
                label: item,
            })) || []
        );
    }, [selectedCategory]);

    if (loading) return <FilterScreenSkeleton theme={theme} />;

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className={`max-w-[556px] w-full mx-auto flex flex-col min-h-screen
            ${theme === "dark" ? "bg-[#121212] text-white" : "bg-white text-gray-800"}`}
        >
            <div className="my-4 text-end">
                <MainHeader />
            </div>

            <div className="flex-1 overflow-auto px-5" dir="rtl">
                {/* Search */}
                <div className="mt-4 h-12">
                    <div
                        className={`w-full h-full rounded-full px-4
                        ${theme === "dark" ? "bg-[#1e1f24]" : "bg-gray-100"}`}
                    >
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجو"
                            className="w-full h-full bg-transparent outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="relative mt-4 h-12">
                    <button
                        onClick={() =>
                            setOpenDropdown(openDropdown === "category" ? null : "category")
                        }
                        className={`w-full h-full rounded-full px-6 text-right border
                        ${theme === "dark"
                                ? "border-[#444] bg-[#1e1f24]"
                                : "border-gray-300 bg-white"}`}
                    >
                        {selectedCategory?.title || "دسته‌بندی"}
                    </button>

                    <AnimatePresence>
                        {openDropdown === "category" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`absolute top-14 right-0 left-0 rounded-2xl z-50 border max-h-60 overflow-auto
                                ${theme === "dark"
                                        ? "bg-[#1e1f24] border-[#444]"
                                        : "bg-white border-gray-200"}`}
                            >
                                {categories.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedCategory(item);
                                            setActiveTab(null);
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full px-6 py-3 text-right flex gap-2
                                        ${theme === "dark"
                                                ? "hover:bg-[#2a2b30]"
                                                : "hover:bg-gray-100"}`}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-6 h-6"
                                        />
                                        {item.title}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sort */}
                <div className="relative mt-4 h-12">
                    <button
                        onClick={() =>
                            setOpenDropdown(openDropdown === "sort" ? null : "sort")
                        }
                        className={`w-full h-full rounded-full px-6 text-right border
                        ${theme === "dark"
                                ? "border-[#444] bg-[#1e1f24]"
                                : "border-gray-300 bg-white"}`}
                    >
                        مرتب‌سازی
                    </button>

                    <AnimatePresence>
                        {openDropdown === "sort" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`absolute top-14 right-0 left-0 rounded-2xl z-50 border
                                ${theme === "dark"
                                        ? "bg-[#1e1f24] border-[#444]"
                                        : "bg-white border-gray-200"}`}
                            >
                                {sortOptions.map((item) => (
                                    <button
                                        key={item}
                                        className={`w-full px-6 py-3 text-right
                                        ${theme === "dark"
                                                ? "hover:bg-[#2a2b30]"
                                                : "hover:bg-gray-100"}`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Filters */}
                <fieldset className="mt-8">
                    <legend>فیلتر بر اساس</legend>
                </fieldset>

                {filterTabs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`h-[30px] px-4 rounded-full border text-xs
                                ${activeTab === tab.key
                                        ? "bg-[#ff7643] border-[#ff7643] text-white"
                                        : theme === "dark"
                                            ? "border-[#2a2b30] text-[#ff7643]"
                                            : "border-gray-300 text-[#ff7643]"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Price */}
                <label className="block mt-6">قیمت</label>
                <div className="mt-4">
                    <div
                        className={`h-1 rounded-full
                        ${theme === "dark" ? "bg-[#2a2b30]" : "bg-gray-300"}`}
                    />
                    <div className="flex justify-between text-xs text-[#ff7643] mt-2">
                        <span>{priceRange.min.toLocaleString()} تومان</span>
                        <span>{priceRange.max.toLocaleString()} تومان</span>
                    </div>
                </div>

                {/* Actions */}
                <div
                    className={`mt-6 flex gap-4 sticky bottom-0 pt-2
                    ${theme === "dark" ? "bg-[#121212]" : "bg-white"}`}
                >
                    <button
                        className={`flex-1 h-12 rounded-full
                        ${theme === "dark"
                                ? "bg-[#2a2b30] text-gray-300"
                                : "bg-gray-200 text-gray-700"}`}
                    >
                        پاک‌سازی
                    </button>
                    <button className="flex-1 h-12 rounded-full bg-[#ff7643] text-white">
                        اعمال
                    </button>
                </div>
            </div>
            <Navbar />
        </motion.section>
    );
}
