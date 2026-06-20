"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { accessToken, api } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("https://api.manmarket.ir/dashboard/v1/user/wishlist/");
      setWishlist(res.data.results || []);
    } catch (err) {
      console.error("wishlist error:", err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    if (accessToken) fetchWishlist();
  }, [accessToken]);

  // productId = عدد (item.product از wishlist)
  const isInWishlist = (productId) =>
    wishlist.some((item) => item.product === productId);

  const toggleWishlist = async (productId) => {
    if (!accessToken) return;
    try {
      const existingItem = wishlist.find((item) => item.product === productId);
      if (existingItem) {
        await api.delete(
          `https://api.manmarket.ir/dashboard/v1/user/wishlist/${existingItem.id}/`
        );
        setWishlist((prev) => prev.filter((item) => item.product !== productId));
      } else {
        const { data: profile } = await api.get(
          "https://api.manmarket.ir/accounts/v1/profile/"
        );
        const res = await api.post(
          "https://api.manmarket.ir/dashboard/v1/user/wishlist/",
          { user: profile.id, product: productId }
        );
        setWishlist((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
