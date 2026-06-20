"use client";

import { useEffect, useState } from "react";
import Navbar from "@/base/navbar";
import { FavoritesGrid, FavoritesHeader, FavoritesEmptyState } from "@/components/ProfileComponents/favorites";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function FavoritesPage() {
    const { theme } = useTheme();
    const { accessToken, api } = useAuth();
    const { wishlist, toggleWishlist } = useWishlist();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

const fetchProductsFromWishlist = async () => {
    if (!accessToken || !wishlist.length) {
        setProducts([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
        const productPromises = wishlist.map(async (item) => {
            try {
                const res = await api.get(
                    `https://api.manmarket.ir/product/v1/product/${item.product_slug}/`
                );
                return { ...res.data, wishlistProductId: item.product };
            } catch (err) {
                return {
                    id: item.product,
                    wishlistProductId: item.product,
                    title: item.brief_title ?? item.product_slug.replaceAll('-', ' '),
                    brief_title: item.brief_title ?? item.product_slug.replaceAll('-', ' '),
                    image: "/assets/img/placeholder.webp",
                    min_price: 0,
                    avg_rate: 0,
                };
            }
        });

        const productsData = await Promise.all(productPromises);
        setProducts(productsData);
    } catch (err) {
        setProducts([]);
        console.error(err);
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        fetchProductsFromWishlist();
        console.log(wishlist)
    }, [wishlist, accessToken]);

    const handleRemove = async (wishlistProductId) => {
        await toggleWishlist(wishlistProductId);
    };

    const renderSkeleton = () =>
        Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full mb-4">
                <div className={`w-full h-[120px] rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} animate-pulse`} />
                <div className={`mt-3 h-4 w-3/4 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} animate-pulse`} />
                <div className={`mt-2 h-4 w-1/2 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} animate-pulse`} />
            </div>
        ));

    return (
        <main className={`w-full min-h-[70vh] flex justify-center ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            <div className="w-full max-w-[556px]">
                <FavoritesHeader />
                {loading ? (
                    <div className="mt-6 flex flex-col gap-4">{renderSkeleton()}</div>
                ) : products.length === 0 ? (
                    <FavoritesEmptyState onStartproductping={() => console.log("Start productping")} />
                ) : (
                    <FavoritesGrid
                        products={products.map((product) => ({
                            ...product,
                            liked: true,
                            onToggleLike: () => handleRemove(product.wishlistProductId),
                        }))}
                    />
                )}
            </div>
            <Navbar />
        </main>
    );
}
