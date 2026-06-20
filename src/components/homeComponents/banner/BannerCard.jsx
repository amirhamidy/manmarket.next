"use client";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function BannerCard({ children, src }) {
    const { theme } = useTheme();
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-[240px] h-[120px] rounded-[20px] overflow-hidden shrink-0">
            {!loaded && (
                <div
                    className={`absolute inset-0 rounded-[20px] animate-pulse ${
                        theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                    }`}
                />
            )}
            <img
                src={src}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    );
}
