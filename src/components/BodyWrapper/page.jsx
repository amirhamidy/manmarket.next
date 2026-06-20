"use client";

import { useTheme } from "@/context/ThemeContext";

export default function BodyWrapper({ children, fontFamily }) {
    const { theme } = useTheme();

    return (
        <div
            className={`transition-colors overflow-x-hidden duration-300 ${theme === "dark" ? "dark" : ""
                }`}
            style={{
                fontFamily,
                backgroundColor: theme === "dark" ? "#000" : "#ffffff",
                minHeight: "100vh",
            }}
        >
            {children}
        </div>
    );
}