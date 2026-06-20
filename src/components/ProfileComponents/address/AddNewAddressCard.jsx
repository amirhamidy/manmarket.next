"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const AddNewAddressCardSkeleton = () => (
    <div className="max-w-[556px] w-full h-[179px] rounded-3xl border border-dashed flex items-center justify-center gap-2 animate-pulse bg-gray-800">
        <div className="w-6 h-6 bg-gray-700 rounded" />
        <div className="h-3 w-28 bg-gray-700 rounded" />
    </div>
);

const AddNewAddressCard = ({ onClick }) => {
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const textColor = theme === "dark" ? "#fff" : "#757575";
    const borderColor = theme === "dark" ? "#444" : "#d1d5db";
    const bgColor = theme === "dark" ? "#23262B" : "#fff";

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <AddNewAddressCardSkeleton />;

    return (
        <button
            onClick={onClick}
            className="max-w-[556px] w-full h-[179px] rounded-3xl border border-dashed flex items-center justify-center gap-2 transition mt-7"
            style={{ color: textColor, borderColor, backgroundColor: bgColor }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16">
                <path
                    d="M21,11.857H14.143V5H11.857v6.857H5v2.286h6.857V21h2.286V14.143H21Z"
                    transform="translate(-5 -5)"
                    fill={textColor}
                />
            </svg>
            <span className="text-[13px] font-normal select-none">افزودن آدرس جدید</span>
        </button>
    );
};

export default AddNewAddressCard;