"use client";

import { useState, useEffect } from "react";

export default function NotificationItem({ item }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000); // لود 1 ثانیه
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <article className="w-full px-4 py-3 border-b animate-pulse">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <div className="h-4 w-32 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-3 w-12 bg-gray-300 rounded"></div>
                </div>
                <div className="h-3 w-full bg-gray-300 rounded mb-1"></div>
                <div className="h-3 w-5/6 bg-gray-300 rounded mb-1"></div>
                <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
            </article>
        );
    }

    const isNew = item.status === "new";

    return (
        <article
            className={`w-full px-4 py-3 border-b ${isNew
                ? "bg-[#fff7f4] border-[#ff7643]"
                : "bg-[#ededed] border-[#c7c7c7]"
                }`}
        >
            <header className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                        {item.type === "alert" ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff7643">
                                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={isNew ? "#ff7643" : "#757575"}>
                                <path d="M3 7l9 5 9-5-9-5-9 5zm0 4l9 5 9-5" />
                            </svg>
                        )}
                    </div>

                    <h3
                        className={`text-[14px] font-medium ${isNew ? "text-[#ff7643]" : "text-[#757575]"
                            }`}
                    >
                        {item.title}
                    </h3>
                </div>

                <time className="text-[10px] text-[#757575] whitespace-nowrap">
                    {item.date}
                </time>
            </header>
            <p className="text-[12px] text-[#757575] leading-5 mb-3">
                {item.description}
            </p>
            {item.action && (
                <button
                    className={`text-[14px] font-medium ${isNew ? "text-[#ff7643]" : "text-[#757575]"
                        }`}
                >
                    {item.action}
                </button>
            )}
        </article>
    );
}
