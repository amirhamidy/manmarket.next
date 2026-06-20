"use client";

import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LikeToastContext = createContext();

export function LikeToastProvider({ children }) {
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);

    const showToast = (msg) => {
        setMessage(msg);
        setShow(true);
        setTimeout(() => setShow(false), 3000);
    };

    return (
        <LikeToastContext.Provider value={{ showToast }}>
            {children}
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 20, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                        className={`fixed w-[98%] max-w-[556px] top-0 left-1/2 -translate-x-1/2 z-[9999] px-4 py-3 text-[13px] rounded-xl bg-[#ff7643] text-white font-medium shadow-lg text-sm `}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </LikeToastContext.Provider>
    );
}

export const useLikeToast = () => {
    const context = useContext(LikeToastContext);
    if (!context) throw new Error("useLikeToast must be used inside LikeToastProvider");
    return context;
};