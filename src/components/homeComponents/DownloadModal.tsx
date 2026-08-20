"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const SESSION_KEY = "downloadModalShownThisSession";

const downloadOptions = [
    {
        id: "bazaar",
        label: "دانلود از بازار",
        icon: "https://api.manmarket.ir/static/img/DN/m-main-android-2.png",
        href: "https://cafebazaar.ir/app/ir.manmarket.app",
    },
    {
        id: "myket",
        label: "دانلود از مایکت",
        icon: "https://api.manmarket.ir/static/img/DN/m-main-android-3.png",
        href: "https://myket.ir/app/ir.manmarket.app",
    },
    {
        id: "ios",
        label: "نسخه iOS",
        icon: "https://api.manmarket.ir/static/img/DN/m-main-android-4.png",
        href: "https://apps.apple.com/app/YOUR_APP_ID",
    },
    {
        id: "direct",
        label: "دانلود مستقیم",
        icon: "https://api.manmarket.ir/static/img/DN/m-main-android-1.png",
        href: "https://api.manmarket.ir/static/app/ManMarket.apk",
    },
];

export default function DownloadModal() {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const isDark = theme === "dark";

    useEffect(() => {
        const alreadyShown = sessionStorage.getItem(SESSION_KEY);
        if (alreadyShown) return;

        const timer = setTimeout(() => {
            setOpen(true);
            sessionStorage.setItem(SESSION_KEY, "1");
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const close = () => setOpen(false);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        onClick={close}
                        className="fixed inset-0 z-[9999999] bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        key="sheet"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 340, damping: 36, mass: 0.9 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={{ top: 0, bottom: 0.35 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 90) close();
                        }}
                        className={`fixed bottom-0 z-[999999999] left-1/2 -translate-x-1/2 w-full max-w-[556px] rounded-t-[2rem] px-6 pb-10 pt-4 ${isDark ? "bg-[#111111]" : "bg-white"
                            }`}
                        style={{ maxHeight: "50dvh" }}
                        dir="rtl"
                    >
                        <div className="flex justify-center mb-5">
                            <div
                                className={`w-10 h-1 rounded-full ${isDark ? "bg-white/20" : "bg-black/15"
                                    }`}
                            />
                        </div>

                        <div className="flex flex-col items-center gap-1 mb-6">
                            <span
                                className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                دانلود مارکت
                            </span>
                            <span
                                className={`text-[11px] ${isDark ? "text-white/45" : "text-gray-400"
                                    }`}
                            >
                                نسخه مورد نظر خود را انتخاب کنید
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {downloadOptions.map((option) => (
                                <motion.a
                                    key={option.id}
                                    href={option.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileTap={{ scale: 0.93 }}
                                    className="flex flex-col items-center gap-2 py-3 px-1 rounded-2xl transition-colors duration-150"
                                >
                                    <img
                                        src={option.icon}
                                        alt={option.label}
                                        className="w-full object-contain rounded-xl"
                                    />
                                    <span
                                        className={`text-[9px] font-medium text-center leading-tight ${isDark ? "text-white/70" : "text-gray-600"
                                            }`}
                                    >
                                        {option.label}
                                    </span>
                                </motion.a>
                            ))}
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={close}
                            className={`mt-5 w-full h-11 rounded-2xl text-[13px] font-semibold transition-colors duration-150 ${isDark
                                    ? "bg-white/[0.06] text-white/70 hover:bg-white/[0.1]"
                                    : "bg-black/[0.04] text-gray-500 hover:bg-black/[0.07]"
                                }`}
                        >
                            بعداً
                        </motion.button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
