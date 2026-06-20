"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ProductInfo({ title, avgRate, price, dimensions }) {
    const { theme } = useTheme();

    const isLoading = !title;

    const renderStars = (rating) => {
        return (
            <div
                className="flex justify-center items-center gap-1 my-2"
                style={{
                    backgroundColor: theme === "dark" ? "#17181A" : "white",
                    color: theme === "dark" ? "white" : "",
                }}
            >
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="#ff7643"
                >
                    <path d="M13.969,6.308a.6.6,0,0,0-.521-.406L10.027,5.63,8.547,2.353a.6.6,0,0,0-1.093,0L5.974,5.63,2.553,5.9A.6.6,0,0,0,2.181,6.93L4.709,9.394l-.894,3.871a.6.6,0,0,0,.918.634L8,11.722,11.268,13.9a.6.6,0,0,0,.91-.664L11.08,9.4,13.8,6.947A.6.6,0,0,0,13.969,6.308Z" />
                </svg>
                <span className="text-[13px]">{rating}</span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="mb-3 animate-pulse">
                <div
                    className="h-[18px] w-[80%] rounded-md mb-2"
                    style={{ backgroundColor: theme === "dark" ? "#2c2f35" : "#ededed" }}
                />

                <div className="flex items-center gap-2 mb-2">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme === "dark" ? "#2c2f35" : "#ededed" }}
                    />
                    <div
                        className="h-[12px] w-[40px] rounded-md"
                        style={{ backgroundColor: theme === "dark" ? "#2c2f35" : "#ededed" }}
                    />
                </div>

                <div
                    className="h-[12px] w-[50%] rounded-md"
                    style={{ backgroundColor: theme === "dark" ? "#2c2f35" : "#ededed" }}
                />
            </div>
        );
    }

    return (
        <div className="mb-3">
            <h1
                className="text-[15px] font-bold mb-1"
                style={{
                    backgroundColor: theme === "dark" ? "#17181A" : "white",
                    color: theme === "dark" ? "white" : "black",
                }}
            >
                {title}
            </h1>

            <div className="flex gap-1 mb-1">
                {renderStars(avgRate || 0)}
            </div>

            <div className="flex justify-between text-[13px] font-medium text-[#757575]">
                <span>{dimensions}</span>
            </div>
        </div>
    );
}
