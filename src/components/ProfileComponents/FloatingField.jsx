"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function FloatingField({ id, label, type = "text", value, onChange, maxLength, password = false }) {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useTheme();

    const borderColor = focused ? "#ff7643" : theme === "dark" ? "#eeeeee" : "#c7c7c7";
    const textColor = focused ? (theme === "dark" ? "#ffffff" : "#000000") : theme === "dark" ? "#ffffff" : "#757575";
    const labelBg = theme === "dark" ? "#23262B" : "#ffffff";
    const labelColor = focused ? "#ff7643" : theme === "dark" ? "#aaa" : "#757575";
    const bgColor = theme === "dark" ? "#23262B" : "#ffffff";

    return (
        <div className="relative w-full h-[48px]">
            <motion.label
                htmlFor={id}
                className="absolute left-[5%] px-1 pointer-events-none"
                animate={{
                    top: focused || value ? -12 : "50%",
                    translateY: focused || value ? 0 : "-50%",
                    fontSize: focused || value ? "12px" : "16px",
                    color: labelColor,
                    backgroundColor: labelBg,
                }}
                transition={{ duration: 0.2 }}
            >
                {label}
            </motion.label>
            <input
                id={id}
                type={password ? (showPassword ? "text" : "password") : type}
                value={value}
                maxLength={maxLength}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete="off"
                className={`w-full h-full rounded-full border-2 px-6 text-[16px] outline-none transition-colors bg-[${bgColor}] border-[${borderColor}] text-[${textColor}] ${password ? "pr-12" : ""}`}
            />
            {password && (
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300">
                    {showPassword ? "Hide" : "Show"}
                </button>
            )}
        </div>
    );
}
