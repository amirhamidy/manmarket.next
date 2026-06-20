"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LikeToast({ show, message, onClose, theme }) {
    useEffect(() => {
        if (show) {
            const t = setTimeout(onClose, 3000);
            return () => clearTimeout(t);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    className={`fixed top-0 left-1/2 -translate-x-1/2 z-[9999]
                    w-[90%] max-w-[520px] px-4 py-3 rounded-xl text-[13px] font-medium
                    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                    ${theme === "dark" ? "bg-white text-black" : "bg-[#ff7643] text-white"}`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}