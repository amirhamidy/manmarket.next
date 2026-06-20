"use client";

import React from "react";
import Link from "next/link";
import RightIcon from "../icons/rightIcon";
import ProfileIcon from "../icons/ProfileIcon";
import MapIcon from "../icons/mapIcon";
import OrderIcon from "../icons/orderIcon";
import PassIcon from "../icons/passIcon";
import FaqIcon from "../icons/faqIcon";
import { PhoneCallLight } from "../icons/PhoneCallIcon";
import BackIcon from "../icons/backIcon";
import StepIcon from "../icons/stepIcon";
import MainHeader from "@/base/mainHeader";
import { useTheme } from "@/context/ThemeContext";

const MoreItem = () => {
    const { theme } = useTheme();
    const menuItems = [
        { text: "سوالات متداول", link: "/moreitem/faq", icon: <FaqIcon /> },
        { text: "پیگیری سفارشات", link: "/profile/order", icon: <ProfileIcon /> },
        { text: "ارتباط با ما", link: "/moreitem/contactpage", icon: <PhoneCallLight /> },
        { text: "راهنمای خرید قسطی", link: "/calculator", icon: <StepIcon /> },
        { text: "قوانین و مقررات", link: "/moreitem/rules", icon: <MapIcon /> },
        { text: "اهداف و تعهدات ما", link: "/moreitem/target", icon: <OrderIcon /> },
        { text: "دانلود اپلیکیشن من مارکت", link: "#", icon: <PassIcon /> },
    ];

    return (
        <section className={`max-w-[556px] mx-auto h-full  ${theme === "dark" ? "bg-[#000] text-white" : "bg-white text-[white]"}`}>
                <MainHeader />

            <div className="flex flex-col px-3">
                {menuItems.map((item, idx) => (
                    <div key={idx}>
                        <Link
                            href={item.link}
                            className={`flex items-center justify-between px-5 h-12 gap-4 my-2 rounded-3xl text-sm font-normal ${theme === "dark" ? "bg-[#23262B] text-white text-gray-100 hover:bg-gray-700 transition-colors" : "text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"}`}
                        >
                            <div className="flex items-center gap-4">
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                            <span className="rotate-180">
                                <RightIcon />
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MoreItem;
