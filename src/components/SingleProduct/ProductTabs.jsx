"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { toJalaliDate } from "./toJalaliDate";

export default function ProductTabs({ description, specifications = [], reviews = [], warranty }) {
    const [activeTab, setActiveTab] = useState(null);
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const toggleTab = (tab) => {
        setActiveTab(activeTab === tab ? null : tab);
    };

    const stripInlineStyles = (htmlString) => {
        if (!htmlString) return "";
        const div = document.createElement("div");
        div.innerHTML = htmlString;
        div.querySelectorAll("*").forEach(el => el.removeAttribute("style"));
        return div.innerHTML;
    };

    const tabData = [
        {
            id: "info",
            label: "مشخصات",
            content: specifications.length > 0 ? (
                <dl className="grid grid-cols-2 gap-2 text-[13px] text-[#757575]">
                    {specifications.map((spec, i) => (
                        <div
                            key={i}
                            className="col-span-2 flex justify-between items-center py-1 border-b"
                            style={{
                                backgroundColor: theme === "dark" ? "#17181A" : "white",
                                color: theme === "dark" ? "white" : "",
                                borderBottom: theme === "dark" ? "1px solid #645e5e" : "1px solid #f0f0f0",
                            }}
                        >
                            <dt className="font-medium w-[40%]">{spec.name}:</dt>
                            <dd className="w-[60%]">{spec.value}</dd>
                        </div>
                    ))}
                </dl>
            ) : (
                <p className="text-[13px] text-[#757575] py-2">
                    هیچ مشخصاتی ثبت نشده است.
                </p>
            )
        },
        {
            id: "description",
            label: "توضیحات",
            content: description ? (
                <div
                    className="text-[13px] leading-6"
                    style={{
                        backgroundColor: theme === "dark" ? "#17181A" : "white",
                        color: theme === "dark" ? "white" : "#757575",
                    }}
                    dangerouslySetInnerHTML={{ __html: stripInlineStyles(description) }}
                />
            ) : (
                <p className="text-[13px] text-[#757575] py-2">
                    هیچ توضیحی ثبت نشده است.
                </p>
            )
        },
        {
            id: "reviews",
            label: `نظرات (${reviews.length})`,
            content: reviews.length > 0 ? (
                <div className="flex flex-col gap-3 text-[13px]">
                    {reviews.map((rev) => (
                        <div
                            key={rev.id}
                            className="p-3 rounded-md border"
                            style={{
                                backgroundColor: theme === "dark" ? "#17181A" : "white",
                                color: theme === "dark" ? "white" : "#757575",
                                border: theme === "dark" ? "1px solid #645e5e" : "1px solid #f0f0f0",
                            }}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs opacity-70">
                                    {toJalaliDate(rev.created_date)}
                                </span>

                                {rev.rate > 0 && (
                                    <span className="text-xs flex items-center justify-center gap-1">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#ff7643">
                                            <path d="M13.969,6.308a.6.6,0,0,0-.521-.406L10.027,5.63,8.547,2.353a.6.6,0,0,0-1.093,0L5.974,5.63,2.553,5.9A.6.6,0,0,0,2.181,6.93L4.709,9.394l-.894,3.871a.6.6,0,0,0,.918.634L8,11.722,11.268,13.9a.6.6,0,0,0,.91-.664L11.08,9.4,13.8,6.947A.6.6,0,0,0,13.969,6.308Z"></path>
                                        </svg> {rev.rate}
                                    </span>
                                )}
                            </div>

                            <p className="leading-6">{rev.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-[13px] text-[#757575] py-2">
                    نظری وجود ندارد
                </p>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="mb-8 animate-pulse">
                <div className="h-8 w-32 rounded-md mb-3"
                    style={{ backgroundColor: theme === "dark" ? "#2c2f35" : "#ededed" }}
                />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="mb-2">
                        <div className="h-6 w-full rounded-md mb-1"
                            style={{ backgroundColor: theme === "dark" ? "#2c2f35" : "#ededed" }}
                        />
                        <div className="h-4 w-3/4 rounded-md"
                            style={{ backgroundColor: theme === "dark" ? "#2c2f35" : "#ededed" }}
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="mb-8">
            {/* 🎉 باکس گارانتی */}
            {warranty && (
                <div
                    className="flex justify-between items-center w-full p-3 rounded-md text-[13px] font-medium mb-3"
                    style={{
                        backgroundColor: theme === "dark" ? "#17181A" : "white",
                        color: theme === "dark" ? "white" : "#757575",
                        border: theme === "dark" ? "1px solid #645e5e" : "1px solid #f5f2f2",
                    }}
                >
                    {warranty}
                </div>
            )}

            <div className="flex flex-col gap-2">
                {tabData.map((tab) => (
                    <div key={tab.id}>
                        <button
                            onClick={() => toggleTab(tab.id)}
                            className="flex justify-between items-center w-full p-3 rounded-md text-[13px] font-medium transition-colors"
                            style={{
                                backgroundColor: theme === "dark" ? "#17181A" : "white",
                                color: theme === "dark" ? "white" : "#757575",
                                border: theme === "dark" ? "1px solid #645e5e" : "1px solid #f5f2f2",
                            }}
                        >
                            {tab.label}
                            <motion.span
                                animate={{ rotate: activeTab === tab.id ? 90 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg
                                    className="rotate-180"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M9 18L15 12L9 6"
                                        stroke="#757575"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </motion.span>
                        </button>

                        <AnimatePresence>
                            {activeTab === tab.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden mt-2"
                                >
                                    {tab.content}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}