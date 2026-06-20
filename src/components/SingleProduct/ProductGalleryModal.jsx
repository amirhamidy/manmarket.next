"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";

export default function ProductGalleryModal({ open, images = [], initialIndex = 0, onClose, maxWidth = 556 }) {
    const { theme } = useTheme();
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [showToast, setShowToast] = useState(false);

    // وقتی modal باز شد، توست رو بعد از یک رندر کوچک نشون بده
    useEffect(() => {
        if (open) {
            setActiveIndex(initialIndex);

            // کمی تأخیر برای اطمینان از mount modal
            const timer = setTimeout(() => setShowToast(true), 50);
            const hideTimer = setTimeout(() => setShowToast(false), 3050);

            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
                setShowToast(false);
            };
        }
    }, [open, initialIndex]);

    return (
        <>
            {/* Modal */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center"
                        style={{
                            backgroundColor: theme === "dark" ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.98)",
                            zIndex: 9999
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    >
                        <motion.div
                            className="w-full h-full flex items-center justify-center"
                            style={{ maxWidth: maxWidth, width: "100%" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-2xl opacity-70 hover:opacity-100 transition"
                                style={{ color: theme === "dark" ? "white" : "black" }}
                            >
                                ✕
                            </button>

                            <Swiper
                                direction="vertical"
                                initialSlide={activeIndex}
                                slidesPerView={1}
                                spaceBetween={20}
                                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                className="w-full h-full"
                            >
                                {images.map((img, i) => (
                                    <SwiperSlide
                                        key={i}
                                        className="flex items-center justify-center w-full h-full"
                                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <motion.img
                                            src={img}
                                            className="object-contain rounded-xl max-h-full max-w-full"
                                            initial={{ scale: 0.96, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.25 }}
                                            draggable={false}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[10000] w-[90%] max-w-[520px] px-4 py-3 rounded-xl text-[13px] font-medium  ${theme === "dark"
                                ? "bg-[#1e1f22] text-white border border-[#ff7643]/30"
                                : "bg-[#ff7643] text-white"
                            }`}
                    >
                        به پایین اسکرول کنید
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}