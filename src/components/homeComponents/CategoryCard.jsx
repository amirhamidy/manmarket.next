"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ category }) {
    const { theme } = useTheme();
    const [imgSrc, setImgSrc] = useState(category.img);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        setOpacity(0);
        const timeout = setTimeout(() => {
            if (theme === "dark") {
                const darkSrc = category.img.replace("/assets/img/", "/assets/img/dark-category/");
                fetch(darkSrc, { method: "HEAD" })
                    .then(res => setImgSrc(res.ok ? darkSrc : category.img))
                    .finally(() => setOpacity(1));
            } else {
                setImgSrc(category.img);
                setOpacity(1);
            }
        }, 200);

        return () => clearTimeout(timeout);
    }, [theme, category.img]);

    return (
        <Link href={`/category/${category.slug}`} className="block">
            <div className={`w-16 rounded-xl flex flex-col items-center justify-center text-center py-1 transition-colors duration-300 ${theme === "dark" ? "bg-[#23262B]" : "bg-[#fff7f4]"}`}>
                <Image
                    src={imgSrc}
                    alt={category.name}
                    width={40}
                    height={40}
                    className="object-contain transition-opacity duration-500"
                    style={{ opacity }}
                    onError={(e) => { e.currentTarget.src = category.img; }}
                />
                <span className="text-[9px] text-[#ff7643] font-extrabold mb-1.5">{category.name}</span>
            </div>
        </Link>
    );
}