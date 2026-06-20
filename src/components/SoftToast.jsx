"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function SoftToast({ show, message }) {
    const { theme } = useTheme();

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`fixed top-0 left-1/2 max-w-[556px] transform -translate-x-1/2 z-[999999] w-[90%] px-4 py-3 rounded-xl shadow-lg text-[13px] font-medium ${theme === "dark"
                            ? "bg-white text-black"
                            : "bg-[#ff7643] text-white"
                        }`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
