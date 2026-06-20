"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function SoftToast({ show, message }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[999999]
                               w-[90%] max-w-[520px] px-4 py-3 rounded-xl
                               text-[13px] font-medium text-white
                               bg-[#ff7643]
                               shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}