"use client";

import { useEffect, useState } from "react";
import CartFooter from "./CartFooter";
import MainHeader from "@/base/mainHeader";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

function CartItemSkeleton() {
    const { theme } = useTheme();
    const bg = theme === "dark" ? "#23262B" : "#ffffff";
    const pulse = theme === "dark" ? "bg-gray-700" : "bg-gray-200";
    return (
        <div className="relative w-full overflow-hidden rounded-3xl">
            <div className="relative z-10 h-full">
                <div dir="ltr" className={`flex justify-start items-center rounded-3xl shadow-[0_8px_16px_rgba(0,11,36,0.04)] px-2 animate-pulse`} style={{ minHeight: "120px", width: "100%", backgroundColor: bg }}>
                    <div className="flex-shrink-0 w-[28%] sm:w-[20%] md:w-[20%]"><div className={`w-full h-[80px] rounded-xl ${pulse}`} /></div>
                    <div className="flex flex-col justify-start text-[12px] space-y-3 flex-1 px-2 overflow-hidden"><div className={`h-4 rounded w-4/5 ${pulse}`} /><div className="flex flex-wrap gap-2"><div className={`h-3 rounded w-14 ${pulse}`} /><div className={`h-3 rounded w-16 ${pulse}`} /><div className={`h-3 rounded w-12 ${pulse}`} /></div></div>
                    <div className="flex flex-col items-center justify-between h-[80px] mx-2"><div className={`w-6 h-6 rounded-full ${pulse}`} /><div className={`w-4 h-4 rounded ${pulse}`} /><div className={`w-6 h-6 rounded-full ${pulse}`} /></div>
                </div>
            </div>
        </div>
    );
}

export default function CartPage() {
    const { theme } = useTheme();
    const { api } = useAuth();
    const [items, setItems] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get("/cart/v1/cart/");
                if (res.status >= 200 && res.status < 300) {
                    const cartData = res.data;
                    const mappedItems = await Promise.all(cartData.cart_items.map(async (item) => {
                        try {
                            console.log(item)
                            const prodRes = await api.get(`https://api.manmarket.ir/product/v1/product/${item.product_slug}/`);
                            const prodData = prodRes.data;
                            const colorInv = prodData.color_inventories.find(c => c.id === item.color_inventory);
                            const colorHex = colorInv?.hex_color || "#000000";
                            const productImage = prodData.product_images.find(img => img.color === item.color_inventory)?.file || prodData.image || "/images/placeholder.png";
                            return {
                                id: item.id,
                                name: item.product_title,
                                ram: prodData.specifications.find(s => s.name.includes("RAM"))?.value || "",
                                memory: prodData.specifications.find(s => s.name.includes("حافظه داخلی"))?.value || "",
                                color: colorHex,
                                price: parseInt(colorInv?.price || item.price),
                                stock: colorInv?.stock || 0,
                                count: item.quantity,
                                color_inventory: item.color_inventory,
                                product_id: item.product,
                                src: productImage
                            };
                        } catch {
                            return {
                                id: item.id,
                                name: item.product_title,
                                ram: "",
                                memory: "",
                                color: "#000000",
                                price: item.price,
                                stock: 0,
                                count: item.quantity,
                                color_inventory: item.color_inventory,
                                product_id: item.product,
                                src: "/images/placeholder.png"
                            };
                        }
                    }));
                    setItems(mappedItems);
                }
            } catch { }
            finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [api]);

    const increase = async (itemId) => {
        const item = items.find(p => p.id === itemId);
        if (!item || item.count >= item.stock) return;
        const newCount = item.count + 1;
        try {
            await api.patch(`/cart/v1/cart/update-product/${itemId}/`, { quantity: newCount });
            setItems(prev => prev.map(p => p.id === itemId ? { ...p, count: newCount } : p));
        } catch { }
    };

    const decrease = async (itemId) => {
        const item = items.find(p => p.id === itemId);
        if (!item) return;
        const newCount = item.count - 1;
        if (newCount === 0) {
            removeItem(itemId);
            return;
        }
        try {
            await api.patch(`/cart/v1/cart/update-product/${itemId}/`, { quantity: newCount });
            setItems(prev => prev.map(p => p.id === itemId ? { ...p, count: newCount } : p));
        } catch { }
    };

    const removeItem = async (itemId) => {
        try { await api.delete(`/cart/v1/cart/delete-product/${itemId}/`); } catch { }
        setItems(prev => prev.filter(p => p.id !== itemId));
    };

    const handleStartproductping = () => console.log("Start productping clicked!");
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.count, 0);
    const cardBg = theme === "dark" ? "#23262B" : "#ffffff";
    const shadow = theme === "dark" ? "shadow-none" : "shadow-[0_8px_16px_rgba(0,11,36,0.04)]";
    const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";

    return (
        <div className="flex justify-center">
            <div className="flex flex-col min-h-screen w-full max-w-[556px]">
                    <MainHeader />
                <main className="flex-1 w-full max-w-[556px] flex flex-col items-center py-5 px-4 space-y-3 mx-auto">
                    {loading ? Array.from({ length: 6 }).map((_, i) => <CartItemSkeleton key={i} />) : items.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center text-center px-6 py-24 ${textColor}`}>
                            <svg className="my-6" xmlns="http://www.w3.org/2000/svg" width="64" height="57.599" viewBox="0 0 64 57.599">
                                <path d="M65.429,17.568a3.176,3.176,0,0,0-2.63-1.417H19.065L15.372,7.044A6.38,6.38,0,0,0,9.465,3H2V9.576H9.465l15.18,37.431A3.2,3.2,0,0,0,27.6,49.029H53.2a3.212,3.212,0,0,0,3-2.13l9.6-26.3A3.364,3.364,0,0,0,65.429,17.568Z" fill={theme === "dark" ? "#777" : "#757575"} />
                                <circle cx="4.009" cy="4.009" r="4.009" transform="translate(22.519 49.58)" fill={theme === "dark" ? "#777" : "#757575"} />
                                <circle cx="4.009" cy="4.009" r="4.009" transform="translate(45.038 49.58)" fill={theme === "dark" ? "#777" : "#757575"} />
                            </svg>
                            <h2 className="text-[18px] font-bold mb-3"> در سبد خرید شما محصولی وجود ندارد</h2>
                            <Link href="/" onClick={handleStartproductping} className="bg-[#ff7643] hover:bg-[#ff5e2b] transition text-white px-10 py-3 rounded-full text-[13px]">دیدن از سایت</Link>
                        </div>
                    ) : items.map((p) => {
                        const isActive = activeId === p.id;
                        return (
                            <div key={p.id} className="relative w-full overflow-hidden rounded-3xl" style={{ minHeight: "120px" }}>
                                <button onClick={() => removeItem(p.id)} className={`absolute top-1/2 -translate-y-1/2 right-3 w-24 h-24 rounded-3xl bg-[#EF5350] flex items-center justify-center z-0 transition-all duration-300 ease-out ${isActive ? "opacity-100" : "opacity-0"}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24"><path d="M6 7h12M9 7v12M15 7v12M8 4h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                                <div onClick={() => setActiveId(isActive ? null : p.id)} className={`relative z-10 h-full transition-transform duration-500 ease-in-out ${isActive ? "-translate-x-20" : "translate-x-0"}`}>
                                    <div dir="ltr" className={`flex justify-start items-center rounded-3xl px-2 ${shadow}`} style={{ minHeight: "120px", width: "100%", backgroundColor: cardBg }}>
                                        <div className="flex-shrink-0 w-[28%] sm:w-[20%] md:w-[20%]">
                                            <img className="w-full h-full object-contain" src={p.src} alt={p.name} />
                                        </div>
                                        <div className={`flex flex-col justify-start text-[12px] space-y-2 flex-1 px-2 overflow-hidden ${textColor}`}>
                                            <span className="line-clamp-2">{p.name}</span>
                                            <div className="flex flex-wrap gap-2">
                                                <div className="gap-2 flex text-nowrap"><span>{p.ram}</span><span>: رام</span></div>
                                                <div className="gap-2 flex text-nowrap"><span>{p.memory}</span><span>: حافظه</span></div>
                                                <div className="gap-2 flex items-center justify-center text-nowrap">
                                                    <span className="relative w-4 h-4 rounded-full border border-gray-500"><span className="absolute inset-1 rounded-full" style={{ backgroundColor: p.color }} /></span>
                                                    <span>: رنگ</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-between h-[80px] mx-2">
                                            <button onClick={(e) => { e.stopPropagation(); increase(p.id); }} disabled={p.count === p.stock || p.stock === 0} className="w-6 h-6 rounded-full bg-[#FF7643] flex items-center justify-center disabled:opacity-30">
                                                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                                            </button>
                                            <span className="text-[#FF7643] text-[13px] font-medium">{p.count}</span>
                                            <button onClick={(e) => { e.stopPropagation(); decrease(p.id); }} className="w-6 h-6 rounded-full border border-[#FF7643] flex items-center justify-center">
                                                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 12h14" stroke="#FF7643" strokeWidth="2" strokeLinecap="round" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </main>
                <div className="flex justify-center items-center px-4">
                    <div className={`w-full max-w-[556px] sticky bottom-0 rounded-3xl z-50 px-1 pt-3 ${theme === "dark" ? "bg-[#23262B]" : "bg-[#fff7f4]"}`}>
                        <CartFooter
                            total={totalPrice.toLocaleString("fa-IR")}
                            onCheckout={() => console.log("Checkout")}
                            onDeleteAll={() => setItems([])}
                            items={items}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}