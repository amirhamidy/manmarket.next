"use client";

import Navbar from "@/base/navbar";
import { RatingsHeader, RatingsList } from "@/components/ProfileComponents/rating";
import { useTheme } from "@/context/ThemeContext";

export default function ProfileRatingsPage() {
    const { theme } = useTheme();

    const ratings = [
        {
            id: 1,
            name: "Sony Headphone WH-1000XM5",
            rating: 5.0,
            review:
                "کیفیت صدا فوق‌العاده‌ست، نویز کنسلینگ عالیه و باتری هم خیلی خوب نگه می‌داره.",
            src: "/next.svg",
        },
        {
            id: 2,
            name: "Sony Headphone WH-1000XM5",
            rating: 5.0,
            review:
                "کیفیت صدا فوق‌العاده‌ست، نویز کنسلینگ عالیه و باتری هم خیلی خوب نگه می‌داره.",
            src: "/next.svg",
        },
        {
            id: 3,
            name: "Sony Headphone WH-1000XM5",
            rating: 5.0,
            review:
                "کیفیت صدا فوق‌العاده‌ست، نویز کنسلینگ عالیه و باتری هم خیلی خوب نگه می‌داره.",
            src: "/next.svg",
        },
        {
            id: 4,
            name: "Sony Headphone WH-1000XM5",
            rating: 5.0,
            review:
                "کیفیت صدا فوق‌العاده‌ست، نویز کنسلینگ عالیه و باتری هم خیلی خوب نگه می‌داره.",
            src: "/next.svg",
        },
    ];

    const bgColor = theme === "dark" ? "#000" : "#ffffff";

    return (
        <div className={`flex justify-center items-center bg-${bgColor}`}>
            <div className="flex flex-col max-w-[556px] w-full min-h-screen" style={{ backgroundColor: bgColor }}>
                <RatingsHeader />
                <RatingsList items={ratings} />
                <Navbar />
            </div>
        </div>
    );
}
