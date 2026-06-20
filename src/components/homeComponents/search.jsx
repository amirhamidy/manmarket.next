"use client";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import clsx from "clsx";
import SearchIcon from "../icons/searchIcon";
import CloseIcon from "../icons/closeIcon";
import { motion, AnimatePresence } from "framer-motion";
import ProductCardSEOClientWrapper from "./ProductCardSEOClientWrapper";
import Link from "next/link";

const SYNONYM_GROUPS = [
    ["اپل", "آیفون", "ایفون", "ايفون", "apple", "iphone"],
    ["موبایل", "گوشی", "گوشي", "تلفن همراه", "تلفن", "موبايل"],
    ["شیائومی", "شياومي", "شیاومی", "سیائومی", "xiaomi", "redmi", "ردمی", "ردمي", "پوکو", "poco"],
    ["سامسونگ", "سامسونق", "samsung", "galaxy", "گلکسی", "گلكسي"],
    ["هواوی", "هوآوی", "هواوي", "huawei"],
    ["نوکیا", "نوكيا", "nokia"],
    ["ال جی", "ال‌جی", "الجي", "lg"],
    ["سونی", "سوني", "sony"],
    ["آنر", "هانر", "honor"]
];

function normalizeSearchQuery(query) {
    const words = query.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return query;
    return words.map(word => {
        const normalizedWord = word.toLowerCase().normalize("NFC");
        for (const group of SYNONYM_GROUPS) {
            if (group.some(syn =>
                syn.toLowerCase().normalize("NFC") === normalizedWord ||
                normalizedWord.includes(syn.toLowerCase().normalize("NFC")) ||
                syn.toLowerCase().normalize("NFC").includes(normalizedWord)
            )) {
                return group[0];
            }
        }
        return word;
    }).join(" ");
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const dropdownVariants = {
    hidden: { opacity: 0, y: -16, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.97,
        transition: { duration: 0.22, ease: "easeIn" },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.055, duration: 0.32, ease: [0.22, 1, 0.36, 1] },
    }),
};

const SearchInputBar = () => {
    const { theme } = useTheme();
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const abortControllerRef = useRef(null);

    const isLight = theme === "light";

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // lock body scroll when dropdown is open
    useEffect(() => {
        if (showResults) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
            document.body.style.overflowY = "scroll";
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflowY = "";
            if (scrollY) window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflowY = "";
        };
    }, [showResults]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (value.trim().length < 3) {
            setResults([]);
            setError(null);
            setShowResults(false);
            return;
        }

        setSearchLoading(true);
        setError(null);

        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const timer = setTimeout(async () => {
            try {
                const normalizedQuery = normalizeSearchQuery(value);
                const response = await fetch(
                    `https://api.manmarket.ir/product/v1/product/?search=${encodeURIComponent(normalizedQuery)}`,
                    { signal: controller.signal }
                );
                if (!response.ok) throw new Error("خطا در دریافت داده‌ها");
                const data = await response.json();
                if (controller.signal.aborted) return;

                const fullResults = await Promise.all(
                    (data.results || []).map(async product => {
                        try {
                            const resSingle = await fetch(product.absolute_url);
                            if (!resSingle.ok) return product;
                            const fullData = await resSingle.json();
                            return { ...product, fullData };
                        } catch {
                            return product;
                        }
                    })
                );

                setResults(fullResults);
                setShowResults(true);
            } catch (err) {
                if (err.name !== "AbortError" && !controller.signal.aborted) {
                    setError(err.message);
                    setResults([]);
                }
            } finally {
                if (!controller.signal.aborted) setSearchLoading(false);
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [value]);

    const handleChange = (e) => {
        setValue(e.target.value);
        if (e.target.value.trim().length >= 3) setShowResults(true);
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (value.trim().length >= 3 && (results.length > 0 || searchLoading || error)) {
            setShowResults(true);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const clearSearch = () => {
        setValue("");
        setResults([]);
        setError(null);
        setShowResults(false);
        inputRef.current?.focus();
    };

    const shouldShowDropdown = showResults && (searchLoading || results.length > 0 || error !== null || (value.trim().length >= 3 && !searchLoading));

    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {showResults && (
                    <motion.div
                        key="overlay"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={() => setShowResults(false)}
                        className="fixed inset-0 z-40"
                        style={{
                            background: isLight
                                ? "rgba(0,0,0,0.18)"
                                : "rgba(0,0,0,0.55)",
                            backdropFilter: "blur(6px)",
                            WebkitBackdropFilter: "blur(6px)",
                        }}
                    />
                )}
            </AnimatePresence>

            <div ref={searchRef} className="px-5 mt-4 relative z-50">
                {/* Input bar */}
                <motion.div
                    animate={{
                        boxShadow: isFocused || showResults
                            ? isLight
                                ? "0 4px 32px 0 rgba(0,0,0,0.10)"
                                : "0 4px 32px 0 rgba(0,0,0,0.45)"
                            : "0 0px 0px 0 rgba(0,0,0,0)",
                        scale: isFocused || showResults ? 1.012 : 1,
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={clsx(
                        "relative flex items-center h-12 transition-colors duration-500",
                        isLight
                            ? "bg-[#f0f0f0]"
                            : "bg-[#17181A] border border-[#2e3035]"
                    )}
                    style={{
                        borderRadius: "999px",
                        padding: "0 16px",
                    }}
                >
                    {/* Left icon area */}
                    <div className="flex-shrink-0 z-10 w-6 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="skeleton"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-5 h-5 rounded-full animate-pulse"
                                    style={{ background: isLight ? "#d1d1d1" : "#2e3035" }}
                                />
                            ) : searchLoading && value.trim().length >= 3 ? (
                                <motion.div
                                    key="spinner"
                                    initial={{ opacity: 0, rotate: 0 }}
                                    animate={{ opacity: 1, rotate: 360 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ rotate: { repeat: Infinity, duration: 0.8, ease: "linear" }, opacity: { duration: 0.2 } }}
                                    className="w-5 h-5 rounded-full border-2 border-t-transparent"
                                    style={{ borderColor: isLight ? "#aaa" : "#666" }}
                                />
                            ) : value ? (
                                <motion.button
                                    key="clear"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    onClick={clearSearch}
                                    aria-label="پاک کردن جستجو"
                                    whileTap={{ scale: 0.85 }}
                                    className="p-1 rounded-full"
                                    style={{
                                        background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)",
                                    }}
                                >
                                    <CloseIcon className={clsx("w-3.5 h-3.5", isLight ? "text-[#888]" : "text-[#888]")} />
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="search-icon"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    aria-label="جستجو"
                                    whileTap={{ scale: 0.85 }}
                                >
                                    <SearchIcon className={clsx("w-5 h-5 transition-colors duration-500", isLight ? "text-[#aaa]" : "text-[#555]")} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Input */}
                    <div className="relative flex-1 mr-3">
                        {loading ? (
                            <div
                                className="w-3/4 h-4 rounded-full animate-pulse"
                                style={{ background: isLight ? "#d1d1d1" : "#2e3035" }}
                            />
                        ) : (
                            <>
                                <AnimatePresence>
                                    {!value && (
                                        <motion.label
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className={clsx(
                                                "absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[13px] select-none",
                                                isLight ? "text-[#bbb]" : "text-[#444]"
                                            )}
                                        >
                                            جستجو محصول...
                                        </motion.label>
                                    )}
                                </AnimatePresence>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={value}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className={clsx(
                                        "w-full bg-transparent outline-none text-right text-[14px] safari-input",
                                        isLight ? "text-[#333]" : "text-[#e8e8e8]"
                                    )}
                                />
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Dropdown */}
                <AnimatePresence>
                    {shouldShowDropdown && (
                        <motion.div
                            key="dropdown"
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={clsx(
                                "absolute top-full mt-3 z-50 overflow-hidden",
                                "left-1/2 -translate-x-1/2",
                                "w-[calc(100%-40px)] max-w-fit w-full flex justify-center flex-col items-center",
                                isLight
                                    ? "bg-white/90 border border-black/[0.06]"
                                    : "bg-[#18191b]/95 border border-white/[0.06]"
                            )}
                            style={{
                                borderRadius: "20px",
                                boxShadow: isLight
                                    ? "0 8px 48px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06)"
                                    : "0 8px 48px 0 rgba(0,0,0,0.55), 0 1.5px 6px 0 rgba(0,0,0,0.3)",
                                backdropFilter: "blur(20px)",
                                WebkitBackdropFilter: "blur(20px)",
                                maxHeight: "80vh",
                            }}
                        >
                            {searchLoading ? (
                                <div className="p-8 flex flex-col items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                                        className="w-7 h-7 rounded-full border-2 border-t-transparent"
                                        style={{ borderColor: isLight ? "#ccc" : "#444" }}
                                    />
                                    <p className={clsx("text-sm", isLight ? "text-[#aaa]" : "text-[#555]")}>
                                        در حال جستجو...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="p-8 flex flex-col items-center gap-3">
                                    <motion.div
                                        initial={{ scale: 0.7, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <svg className="w-9 h-9 text-yellow-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </motion.div>
                                    <p className={clsx("text-sm", isLight ? "text-[#aaa]" : "text-[#555]")}>{error}</p>
                                </div>
                            ) : results.length === 0 ? (
                                <div className="p-8 flex flex-col items-center gap-3">
                                    <motion.div
                                        initial={{ scale: 0.7, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <svg className={clsx("w-12 h-12", isLight ? "text-[#ddd]" : "text-[#2e3035]")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </motion.div>
                                    <p className={clsx("text-sm font-medium", isLight ? "text-[#999]" : "text-[#555]")}>
                                        محصولی پیدا نشد
                                    </p>
                                    <p className={clsx("text-xs text-center leading-6", isLight ? "text-[#ccc]" : "text-[#3a3d42]")}>
                                        از مترادف‌های دیگر استفاده کنید
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div
                                        className={clsx(
                                            "px-5 py-3.5 flex items-center gap-2",
                                            isLight ? "border-b border-black/[0.05]" : "border-b border-white/[0.04]"
                                        )}
                                    >
                                        <motion.span
                                            initial={{ opacity: 0, x: 6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className={clsx(
                                                "text-xs font-semibold px-2.5 py-1 rounded-full",
                                                isLight
                                                    ? "bg-black/[0.05] text-[#888]"
                                                    : "bg-white/[0.05] text-[#555]"
                                            )}
                                        >
                                            {results.length} محصول
                                        </motion.span>
                                    </div>

                                    {/* Results list */}
                                    <div
                                        className="p-3 flex flex-col gap-2 overflow-y-auto"
                                        style={{ maxHeight: "60vh" }}
                                    >
                                        {results.map((product, i) => (
                                            <motion.div
                                                key={`search-result-${product.slug}-${i}`}
                                                custom={i}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                <Link
                                                    href={`/product/item/${product.slug}`}
                                                    onClick={() => setShowResults(false)}
                                                    className={clsx(
                                                        "block w-full rounded-2xl overflow-hidden transition-colors duration-200",
                                                        isLight
                                                            ? "hover:bg-black/[0.03]"
                                                            : "hover:bg-white/[0.03]"
                                                    )}
                                                >
                                                    <ProductCardSEOClientWrapper product={product.fullData || product} />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default SearchInputBar;
