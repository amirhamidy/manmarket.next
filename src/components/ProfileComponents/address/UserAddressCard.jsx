"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export const UserAddressCardSkeleton = () => (
    <article className="max-w-[556px] w-full rounded-3xl p-6 animate-pulse bg-gray-800">
        <div className="space-y-3">
            <div className="h-4 w-40 bg-gray-700 rounded" />
            <div className="h-3 w-64 bg-gray-700 rounded" />
            <div className="h-3 w-48 bg-gray-700 rounded" />
            <div className="h-3 w-32 bg-gray-700 rounded" />
        </div>
    </article>
);

export const EmptyAddressCard = () => (
    <div className="max-w-[556px] w-full rounded-3xl p-6 flex items-center justify-center bg-gray-200 dark:bg-[#23262B]">
        <span className="text-[14px] font-bold text-gray-700 dark:text-gray-300">
            فعلاً آدرسی موجود نیست
        </span>
    </div>
);

export const UserAddressCard = ({ data, onEdit, onDelete }) => {
    const { theme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    const textColor = theme === "dark" ? "#fff" : "#374151";
    const bgColor = theme === "dark" ? "#23262B" : "#fff";
    const borderColor = theme === "dark" ? "#444" : "#e5e7eb";

    useEffect(() => {
        const handleClickOutside = e => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <article
            className="relative max-w-[556px] w-full rounded-3xl p-6 mt-3"
            style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
        >
            <button
                onClick={() => setMenuOpen(prev => !prev)}
                className="absolute top-5 left-5 text-xl"
                style={{ color: textColor }}
            >
                ⋮
            </button>

            <div ref={menuRef}>
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-12 left-5 w-36 rounded-xl shadow-lg overflow-hidden z-50"
                            style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
                        >
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onEdit(data);
                                }}
                                className="w-full text-right px-4 py-2 text-[13px]"
                                style={{ color: textColor }}
                            >
                                تغییر آدرس
                            </button>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onDelete(data.id);
                                }}
                                className="w-full text-right px-4 py-2 text-[13px] text-red-500"
                            >
                                حذف آدرس
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-2 text-[13px]" style={{ color: textColor }}>
                <p className="text-[#ff7643] text-[15px] font-bold">{data.name}</p>
                <p>استان : {data.state}</p>
                <p>شهر : {data.city}</p>
                <p>آدرس : {data.address}</p>
                <p>کد پستی : {data.zip_code}</p>
                {data.phone_number && <p>شماره تلفن : {data.phone_number}</p>}
            </div>
        </article>
    );
};