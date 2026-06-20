"use client";

import RatingCard from "./RatingCard";
import { useTheme } from "@/context/ThemeContext";

export default function RatingsList({ items }) {
  const { theme } = useTheme();

  return (
    <main
      className="flex-1 w-full max-w-[556px] mx-auto px-2 py-4 space-y-3"
    >
      {items.map((item) => (
        <RatingCard key={item.id} item={item} theme={theme} />
      ))}
    </main>
  );
}
