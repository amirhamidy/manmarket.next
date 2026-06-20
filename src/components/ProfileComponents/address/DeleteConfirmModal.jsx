"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function DeleteConfirmModal({ isOpen, onCancel, onConfirm }) {
    const { theme } = useTheme();
    const bgColor = theme === "dark" ? "#23262B" : "#fff";
    const textColor = theme === "dark" ? "#fff" : "#374151";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        onClick={e => e.stopPropagation()}
                        className="relative w-[90%] max-w-[400px] rounded-2xl p-6 flex flex-col gap-4"
                        style={{ backgroundColor: bgColor }}
                    >
                        <h2 className="text-[13px] font-bold text-right" style={{ color: textColor }}>
                            آیا از حذف این آدرس اطمینان دارید؟
                        </h2>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={onCancel} className="px-4 py-2 text-[13px] rounded-full border border-gray-300">انصراف</button>
                            <button onClick={onConfirm} className="px-4 py-2 text-[13px] rounded-full bg-red-500 text-white">حذف</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}