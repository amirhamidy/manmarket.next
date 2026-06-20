"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

function CheckoutCartSkeleton() {
    const { theme } = useTheme();
    const bg = theme === "dark" ? "#23262B" : "#ffffff";
    const pulse = theme === "dark" ? "bg-gray-700" : "bg-gray-200";

    return (
        <div className="w-full rounded-3xl overflow-hidden animate-pulse">
            <div
                className="flex items-center px-2"
                style={{ minHeight: "120px", backgroundColor: bg }}
            >
                <div className="w-[28%]">
                    <div className={`w-full h-[80px] rounded-xl ${pulse}`} />
                </div>

                <div className="flex-1 px-2 space-y-3">
                    <div className={`h-4 w-4/5 rounded ${pulse}`} />
                    <div className="flex gap-2">
                        <div className={`h-3 w-14 rounded ${pulse}`} />
                        <div className={`h-3 w-16 rounded ${pulse}`} />
                        <div className={`h-3 w-12 rounded ${pulse}`} />
                    </div>
                </div>

                <div className={`h-6 w-10 rounded ${pulse}`} />
            </div>
        </div>
    );
}

export default function CheckoutCartList() {
    const { theme } = useTheme();
    const { api } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get("/cart/v1/cart/");
                if (res.status >= 200 && res.status < 300) {
                    const mapped = await Promise.all(
                        res.data.cart_items.map(async (item) => {
                            try {
                                const prodRes = await api.get(
                                    `https://api.manmarket.ir/product/v1/product/${item.product_slug}/`
                                );
                                
                                const prod = prodRes.data;

                                const colorInv = prod.color_inventories.find(
                                    (c) => c.id === item.color_inventory
                                );

                                const image =
                                    prod.product_images.find(
                                        (img) => img.color === item.color_inventory
                                    )?.file || prod.image;

                                return {
                                    id: item.id,
                                    name: item.product_title,
                                    ram:
                                        prod.specifications.find((s) =>
                                            s.name.includes("RAM")
                                        )?.value || "",
                                    memory:
                                        prod.specifications.find((s) =>
                                            s.name.includes("حافظه")
                                        )?.value || "",
                                    color: colorInv?.hex_color || "#000",
                                    qty: item.quantity,
                                    src: image || "/images/placeholder.png",
                                };
                            } catch {
                                return {
                                    id: item.id,
                                    name: item.product_title,
                                    ram: "",
                                    memory: "",
                                    color: "#000",
                                    qty: item.quantity,
                                    src: "/images/placeholder.png",
                                };
                            }
                        })
                    );
                    setItems(mapped);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [api]);

    const cardBg = theme === "dark" ? "#23262B" : "#ffffff";
    const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
    const shadow =
        theme === "dark" ? "shadow-none" : "shadow-[0_8px_16px_rgba(0,11,36,0.04)]";

    if (loading) {
        return (
            <div className="w-full space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <CheckoutCartSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full space-y-3">
            {items.map((p) => (
                <div
                    key={p.id}
                    className={`flex items-center rounded-3xl px-2 ${shadow}`}
                    style={{ minHeight: "120px", backgroundColor: cardBg }}
                    dir=""
                >
                    <div className="w-[28%]">
                        <img
                            src={p.src}
                            alt={p.name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div
                        className={`flex flex-col space-y-2 flex-1 px-2 text-[12px] ${textColor}`}
                    >
                        <span className="line-clamp-2">{p.name}</span>

                        <div className="flex flex-wrap gap-2">
                            {p.ram && (
                                <div className="flex gap-1">
                                    <span>{p.ram}</span>
                                    <span>: رام</span>
                                </div>
                            )}
                            {p.memory && (
                                <div className="flex gap-1">
                                    <span>{p.memory}</span>
                                    <span>: حافظه</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <span className="relative w-4 h-4 rounded-full border">
                                    <span
                                        className="absolute inset-1 rounded-full"
                                        style={{ backgroundColor: p.color }}
                                    />
                                </span>
                                <span>: رنگ</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-3">
                        <span className="text-[#FF7643] text-[13px] font-medium">
                            تعداد : {p.qty}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}