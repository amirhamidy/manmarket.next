"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PriceIcon from "../icons/priceIcon";

export default function CheckoutSummary() {
    const { api } = useAuth();
    const [items, setItems] = useState([]);

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

                                return {
                                    count: item.quantity,
                                    price: parseInt(colorInv?.price || item.price),
                                };
                            } catch {
                                return {
                                    count: item.quantity,
                                    price: parseInt(item.price),
                                };
                            }
                        })
                    );
                    setItems(mapped);
                }
            } catch { }
        };

        fetchCart();
    }, [api]);

    const productsCount = items.reduce((acc, i) => acc + i.count, 0);
    const subtotal = items.reduce((acc, i) => acc + i.price * i.count, 0);
    const shippingCost = 150000;
    const total = subtotal + shippingCost;

    const formatPrice = (v) => v.toLocaleString("fa-IR");

    return (
        <section className="max-w-[556px] w-full flex flex-wrap gap-6 justify-center text-[14px]">
            <div className="flex justify-between gap-1">
                <span className="text-[#ff7643]">تعداد محصولات :</span>
                <span className="text-[#757575]">{productsCount}</span>
            </div>

            <div className="flex justify-between gap-1">
                <span className="text-[#ff7643]">جمع قیمت کل محصولات :</span>
                <span className="text-[#757575] flex items-center gap-1">
                    {formatPrice(subtotal)}
                    {PriceIcon && <PriceIcon />}
                </span>
            </div>

            <div className="flex justify-between gap-1">
                <span className="text-[#ff7643]">هزینه بسته بندی و ارسال :</span>
                <span className="text-[#757575] flex items-center gap-1">
                    {formatPrice(shippingCost)}
                    {PriceIcon && <PriceIcon />}
                </span>
            </div>

            <div className="flex justify-between gap-1">
                <span className="text-[#ff7643]">مبلغ نهایی :</span>
                <span className="text-[#757575] flex items-center gap-1">
                    {formatPrice(total)}
                    {PriceIcon && <PriceIcon />}
                </span>
            </div>
        </section>
    );
}