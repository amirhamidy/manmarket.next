"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductStatsBadge({ stats }) {
    const statsData = [
        { icon: "/unnamed.png", label: "امتیاز محصول", value: stats?.rate || 0 },
        { icon: "/birbir.webp", label: "فروش", value: (stats?.sales || 0) + 1 },
        { icon: "/seenz.png", label: "بازدید", value: stats?.views || 0 },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % statsData.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const currentItem = statsData[currentIndex];

    return (
        <div className="absolute bottom-[*10] left-4 w-max z-50">
            <div className="dark:bg-black/60 backdrop-blur-md rounded-xl px-3 py-1 flex items-center gap-2 select-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.1 }}
                        className="flex items-center gap-2 text-[13px] font-medium"
                    >
                        <img
                            src={currentItem.icon}
                            alt=""
                            className="w-4 h-4 object-contain"
                        />
                        <span>
                            {currentItem.value.toLocaleString()} {currentItem.label}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}