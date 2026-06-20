"use client";

import { useState, useRef } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useLikeToast } from "@/context/LikeToastContext";
import { useAuth } from "@/context/AuthContext";

export function useLike(productId) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { showToast } = useLikeToast();
    const { accessToken } = useAuth();

    const [loading, setLoading] = useState(false);
    const busyRef = useRef(false);

    const liked = isInWishlist(productId);

    const toggle = async (e) => {
        e?.preventDefault();
        e?.stopPropagation();

        // ✅ چک درست
        if (!accessToken) {
            showToast("برای افزودن به علاقه مندی ها ورود / ثبت نام کنید");
            return;
        }

        if (busyRef.current) return;

        busyRef.current = true;
        setLoading(true);

        try {
            await toggleWishlist(productId);

            showToast(
                liked
                    ? "از علاقه‌مندی‌ها حذف شد"
                    : "به علاقه‌مندی‌ها اضافه شد"
            );
        } catch (err) {
            console.error("LIKE ERROR:", err);
        } finally {
            setLoading(false);
            busyRef.current = false;
        }
    };

    return {
        liked,
        loading,
        toggle,
    };
}
