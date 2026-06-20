"use client";

import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import SunIcon from "@/components/icons/SunIcon";
import MoonIcon from "@/components/icons/moonIcon";
import NotifIcon from "@/components/icons/notifIcon";
import { useEffect, useState } from "react";

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={clsx(
                "flex justify-between px-6 py-2 items-center w-full h-14 transition-colors duration-500",
                theme === "dark" ? "bg-[#17181A]" : "bg-white"
            )}
        >
            <button aria-label="Notifications" className="p-2">
                {loading ? (
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                ) : (
                    <NotifIcon
                        className={clsx("w-6 h-6 transition-colors duration-500", {
                            "text-white": theme === "dark",
                            "text-black": theme === "light",
                        })}
                    />
                )}
            </button>
            <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="relative w-10 h-10 flex items-center justify-center"
            >
                <AnimatePresence exitBeforeEnter initial={false}>
                    {loading ? (
                        <div className="absolute w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                    ) : theme === "light" ? (
                        <motion.span
                            key="sun"
                            initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 45, opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute"
                        >
                            <SunIcon className="w-6 h-6 text-black" />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="moon"
                            initial={{ rotate: 45, opacity: 0, scale: 0.8 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -45, opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute"
                        >
                            <MoonIcon className="w-6 h-6 text-white" />
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
};

export default Header;
