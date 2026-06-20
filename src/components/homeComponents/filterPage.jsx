"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import BackIcon from "@/components/icons/backIcon";

export const FILTERS = {
    phone: ["RAM", "حافظه", "دوربین"],
    tablet: ["حافظه", "RAM", "اندازه صفحه نمایش"],
    laptop: ["برند", "CPU", "RAM", "GPU"],
    monitor: ["برند", "وضوح", "سایز صفحه نمایش"],
    "game-console": ["برند", "ظرفیت حافظه", "ریجن"],
    speaker: ["نوع اتصال", "توان خروجی", "قابل حمل"],
    "headset-headphones": ["نوع اتصال", "برند", "نویز کنسلینگ"],
    "smartwatch": ["نوع کاربری", "سازگاری", "برند"],
};

export default function FilterScreen({ onBack }) {
    const [search, setSearch] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeTab, setActiveTab] = useState(null);

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
                const withImage = data.filter((item) => item.image);
                setCategories(withImage);
            })
            .catch((err) => console.error("Failed to fetch categories:", err));
    }, []);

    const filterTabs = useMemo(() => {
        if (!selectedCategory) return [];
        return FILTERS[selectedCategory.slug]?.map((name) => ({ key: name, label: name })) || [];
    }, [selectedCategory]);


    return (
        <section className="max-w-md mx-auto bg-white flex flex-col">
            <header className="flex justify-between items-center px-5 py-4 ">
                <div>
                    <span className="text-1xl font-normal text-gray-700">فیلتر</span>
                    <p className="text-sm mt-1 text-gray-500">جستجو و فیلتر محصولات</p>
                </div>
                <div onClick={onBack} className="cursor-pointer mr-3">
                    <BackIcon />
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex-1 overflow-auto px-5"
                dir="rtl"
            >
                {/* Search */}
                <div className="mt-4 h-12 relative">
                    <div className="relative w-full h-full rounded-full bg-[#ededed] flex flex-row-reverse">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجو"
                            className="absolute text-[13px] right-[16px] top-0 h-full bg-transparent outline-none placeholder-[#757575]"
                        />
                    </div>
                </div>



                {/* Category Selector */}
                <div className="relative mt-4 h-12">
                    <button
                        onClick={() => setCategoryOpen(!categoryOpen)}
                        className="w-full h-full rounded-full border-2 border-[#c7c7c7] flex items-center px-6"
                    >
                        <span className="flex-1 text-right">
                            {selectedCategory?.title || "دسته‌بندی"}
                        </span>
                    </button>

                    {categoryOpen && (
                        <div className="absolute top-14 right-0 left-0 bg-white border rounded-2xl z-10 max-h-60 overflow-auto">
                            {categories.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedCategory(item);
                                        setActiveTab(null);
                                        setCategoryOpen(false);
                                    }}
                                    className="w-full text-right px-6 py-3 hover:bg-[#ededed] flex items-center gap-2"
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-6 h-6 object-contain rounded"
                                        />
                                    )}
                                    <span>{item.title}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort Selector */}
                <div className="relative mt-4 h-12">
                    <button
                        onClick={() => setSortOpen(!sortOpen)}
                        className="w-full h-full rounded-full border-2 border-[#c7c7c7] flex items-center px-6"
                    >
                        <span className="flex-1 text-right">مرتب‌سازی</span>
                    </button>

                    {sortOpen && (
                        <div className="absolute top-14 right-0 left-0 bg-white border rounded-2xl z-10">
                            {sortOptions.map((item) => (
                                <button
                                    key={item}
                                    className="w-full text-right px-6 py-3 hover:bg-[#ededed]"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <fieldset className="block mt-8">
                    <legend className="text-base font-normal">فیلتر بر اساس</legend>
                </fieldset>

                {filterTabs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`h-[30px] px-4 rounded-full border text-xs transition-all
                  ${activeTab === tab.key
                                        ? "bg-[#ff7643] text-white border-[#ff7643]"
                                        : "border-[#ededed] text-[#ff7643]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Price */}
                <label className="block mt-6">قیمت</label>
                <div className="mt-4 relative">
                    <div className="h-1 bg-[#ededed] rounded-full" />
                    <div className="flex justify-between text-xs text-[#ff7643] mt-8">
                        <span>{priceRange.min.toLocaleString()} تومان</span>
                        <span>{priceRange.max.toLocaleString()} تومان</span>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-5 mt-4 flex gap-4 sticky bottom-1.5">
                    <button className="flex-1 h-12 rounded-full bg-[#ededed] text-[#757575]">
                        پاک‌سازی
                    </button>
                    <button className="flex-1 h-12 rounded-full bg-[#ff7643] text-white">
                        اعمال
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
