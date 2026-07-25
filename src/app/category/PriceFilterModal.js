"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15 } },
};

export default function PriceFilterModal({
  isDark,
  isOpen,
  onClose,
  maxPrice,
  currentRange,
  onApply,
}) {
  const [tempRange, setTempRange] = useState(currentRange);

  useEffect(() => {
    setTempRange(currentRange);
  }, [currentRange, isOpen]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), tempRange[1] - 1);
    setTempRange([value, tempRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), tempRange[0] + 1);
    setTempRange([tempRange[0], value]);
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-[60] backdrop-blur-sm bg-black/30"
      />
      <motion.div
        variants={dropdownVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`fixed top-24 left-1/2 -translate-x-1/2 z-[70] w-[90%] max-w-[400px] rounded-3xl p-6 shadow-2xl ${
          isDark
            ? "bg-[#141414] border border-white/5"
            : "bg-white border border-black/5"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <span
            className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            فیلتر قیمت
          </span>
          <button
            onClick={onClose}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative w-full h-12 flex items-center justify-center mb-10">
          <div
            className={`absolute w-full h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-black/5"}`}
          >
            <div
              className="absolute h-full bg-[#ff7643] rounded-full"
              style={{
                left: `${(tempRange[0] / maxPrice) * 100}%`,
                right: `${100 - (tempRange[1] / maxPrice) * 100}%`,
              }}
            />
          </div>

          <input
            type="range"
            min="0"
            max={maxPrice}
            value={tempRange[0]}
            onChange={handleMinChange}
            className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ff7643] [&::-webkit-slider-thumb]:shadow-lg"
          />

          <input
            type="range"
            min="0"
            max={maxPrice}
            value={tempRange[1]}
            onChange={handleMaxChange}
            className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#ff7643] [&::-webkit-slider-thumb]:shadow-lg"
          />
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-[10px] opacity-50 px-2">از (تومان)</span>
            <div
              className={`h-11 rounded-xl flex items-center px-4 text-xs font-medium ${isDark ? "bg-white/5" : "bg-black/5"}`}
            >
              {tempRange[0].toLocaleString()}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <span className="text-[10px] opacity-50 px-2">تا (تومان)</span>
            <div
              className={`h-11 rounded-xl flex items-center px-4 text-xs font-medium ${isDark ? "bg-white/5" : "bg-black/5"}`}
            >
              {tempRange[1].toLocaleString()}
            </div>
          </div>
        </div>

        <button
          onClick={() => onApply(tempRange)}
          className="w-full h-12 bg-[#ff7643] text-white rounded-2xl text-xs font-bold hover:brightness-110 transition-all active:scale-[0.98]"
        >
          اعمال فیلتر
        </button>
      </motion.div>
    </>
  );
}
