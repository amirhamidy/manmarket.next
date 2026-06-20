"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import clsx from "clsx";
import Link from "next/link";

const AdBanner = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            aria-label="Winter Sales Advertisement"
            className={clsx(
                "relative w-[95%] h-36 mx-0 rounded-xl overflow-hidden shadow-[0_8px_16px_rgba(255,118,67,0.043)]",
                theme === "dark" ? "bg-[#23262B]" : "bg-white"
            )}
        >
            {loading ? (
                <div
                    className={clsx(
                        "w-full rounded-xl animate-pulse space-y-3",
                        theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                    )}
                />
            ) : (
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-5 space-y-3">
                    <p className="text-[#c7c7c7] text-[14px] font-normal leading-none mb-2">
                        فروش ویژه
                    </p>

                    <h2 className="text-[#ff7643] text-[18px] font-semibold leading-none mb-2 ">30% تخفیف</h2>

                    <Link href="/category/phone" className="bg-[#ff7643] rounded-md px-3 py-2 ">
                        <span className="text-white text-nowrap text-[13px] font-medium">
                            مشاهده محصولات
                        </span>
                    </Link>
                    <p className="text-[#c7c7c7] text-[13px] font-normal text-center leading-none ">یک کد کوچک، یک تخفیف بزرگ</p>
                </div>
            )}
        </section>
    );
};

export default AdBanner;
