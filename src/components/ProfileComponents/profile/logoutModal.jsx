"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  const { theme } = useTheme();

  const bgColor = theme === "dark" ? "#23262B" : "#ffffff";
  const closeColor = theme === "dark" ? "#9ca3af" : "#6b7280";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[90%] max-w-[420px] rounded-2xl p-6 flex flex-col gap-6"
            style={{ backgroundColor: bgColor }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-6 h-6 flex items-center justify-center"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={closeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h2 className="text-[16px] font-bold text-right">
              خروج از حساب کاربری
            </h2>

            <p className="text-[14px] text-gray-500 text-right leading-6">
              آیا از خروج از حساب کاربری خود اطمینان دارید؟
            </p>

            <div className="flex gap-3 mt-2">
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-full border border-gray-300 text-[14px]"
              >
                انصراف
              </button>

              <button
                onClick={onConfirm}
                className="flex-1 h-11 rounded-full bg-[#ff7643] text-white text-[14px]"
              >
                بله، خارج شو
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
