"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ category }) {
  const { theme } = useTheme();

  return (
    <Link href={`/category/${category.slug}`} className="block">
      <div
        className={`w-16 rounded-xl flex flex-col items-center justify-center text-center py-1 transition-colors duration-300 ${theme === "dark" ? "bg-[#23262B]" : "bg-[#fff7f4]"}`}
      >
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            width={40}
            height={40}
            className="object-contain"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
        )}
        <span className="text-[9px] text-[#ff7643] font-extrabold mt-1">
          {category.name}
        </span>
      </div>
    </Link>
  );
}
