"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

function CartFooterSkeleton() {
    const { theme } = useTheme();
    const bg = theme === "dark" ? "#23262B" : "#fff7f4";
    const pulse = theme === "dark" ? "bg-gray-700" : "bg-gray-200";

    return (
        <div className={`relative rounded-3xl p-5 flex flex-col gap-4 animate-pulse`} style={{ backgroundColor: bg }}>
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className={`h-3 w-16 rounded ${pulse}`} />
                    <div className={`h-6 w-24 rounded ${pulse}`} />
                    <div className={`h-3 w-20 rounded ${pulse}`} />
                </div>
                <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded mb-1 ${pulse}`} />
                    <div className={`h-3 w-14 rounded ${pulse}`} />
                </div>
            </div>
            <div className={`w-full h-12 rounded-full ${pulse}`} />
        </div>
    );
}

export default function CartFooter({ total, onCheckout, onDeleteAll, items }) {
    const { theme } = useTheme();
    const { api } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleDeleteAll = async () => {
        try {
            await Promise.all(items.map(item => api.delete(`/cart/v1/cart/delete-product/${item.id}/`)));
            onDeleteAll();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <CartFooterSkeleton />;

    const bg = theme === "dark" ? "#23262B" : "#fff7f4";
    const textColor = theme === "dark" ? "text-gray-100" : "text-[#ff7643]";

    return (
        <div className={`relative rounded-3xl p-5 flex flex-col gap-4`} style={{ backgroundColor: bg }}>
            <div className="flex justify-between items-center">
                <div>
                    <span className={`mt-2 text-sm ${textColor}`}>قیمت کالا ها </span>
                    <div className={`text-[16px] mt-2 font-semibold ${textColor}`}>{total}</div>
                </div>
                <div className="flex flex-col items-center">
                    <button onClick={handleDeleteAll} className="flex items-center justify-center my-2">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path
                                d="M13.667,2H8.333A1.78,1.78,0,0,0,6.556,3.778V5.556H3V7.333H4.778V18a1.78,1.78,0,0,0,1.778,1.778h8.889A1.78,1.78,0,0,0,17.222,18V7.333H19V5.556H15.444V3.778A1.78,1.78,0,0,0,13.667,2ZM8.333,3.778h5.333V5.556H8.333ZM15.444,18H6.556V7.333h8.889Z"
                                fill={theme === "dark" ? "#fff" : "#757575"}
                            />
                        </svg>
                    </button>
                    <span className={`text-xs ${textColor}`}>پاک کردن همه</span>
                </div>
            </div>
            <Link href="/shopping"
                onClick={onCheckout}
                className={`w-full text-[13px] font-medium py-3 px-3 flex justify-center rounded-full transition`}
                style={{
                    backgroundColor: "#FF7643",
                    color: theme === "dark" ? "#000" : "#fff",
                }}
            >
                تایید و تکمیل سفارش
            </Link>
        </div>
    );
}