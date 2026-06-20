"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import HomeIcon from "@/components/icons/HomeIcon";
import CartIcon from "@/components/icons/CartIcon";
import MoreIcon from "@/components/icons/MoreIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import SearchIcon from "@/components/icons/searchIcon";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const { theme } = useTheme();
    const { accessToken, loading: authLoading } = useAuth();
    const router = useRouter();

    const handleProtectedRoute = (path) => {
        if (!authLoading) {
            if (accessToken) router.push(path);
            else router.push("/login");
        }
    };

    const bgColor = theme === "dark" ? "bg-[#23262b]" : "bg-white";
    const iconColor = theme === "dark" ? "text-white" : "text-black";

    return (
        <nav
            className={`fixed bottom-2 left-1/2 transform -translate-x-1/2 mb-[env(safe-area-inset-bottom)] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-[24px] px-6 py-3 flex justify-between items-center w-[95%] max-w-[556px] z-50 flex-row-reverse ${bgColor}`}
        >
            {authLoading ? (
                <div className="flex justify-between w-full">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-8 h-8 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} animate-pulse`}
                        />
                    ))}
                </div>
            ) : (
                <>

                    <Link href="/" className="cursor-pointer">
                        <HomeIcon />
                    </Link>

                    <Link href="/filter" className="cursor-pointer">
                        <SearchIcon />
                    </Link>

                    <div
                        onClick={() => handleProtectedRoute("/profile/cart")}
                        className="cursor-pointer"
                    >
                        <CartIcon />
                    </div>

                    <div
                        onClick={() => handleProtectedRoute("/profile")}
                        className="cursor-pointer"
                    >
                        <ProfileIcon />
                    </div>

                    <Link href="/moreitem">
                        <MoreIcon />
                    </Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
