"use client";

import { useState, useEffect } from "react";

export default function RatingCard({ item, theme }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const cardBg = theme === "dark" ? "#23262B" : "#ffffff";
  const textColor = theme === "dark" ? "text-white" : "text-[#757575]";
  const subTextColor = theme === "dark" ? "text-gray-300" : "text-[#757575]";
  const skeletonBg = theme === "dark" ? "#1A1A1A" : "#e5e5e5";

  if (loading) {
    return (
      <article
        className={`rounded-3xl px-3 py-3 flex gap-3 animate-pulse`}
        style={{ backgroundColor: cardBg }}
      >
        <div
          className={`w-[80px] h-[80px] flex-shrink-0 rounded-2xl p-1 overflow-hidden`}
          style={{ backgroundColor: skeletonBg }}
        />
        <div className="flex flex-col flex-1 overflow-hidden space-y-2">
          <div className={`h-4 w-3/4 rounded`} style={{ backgroundColor: skeletonBg }}></div>
          <div className={`h-3 w-1/2 rounded`} style={{ backgroundColor: skeletonBg }}></div>
          <div className={`h-3 w-full rounded`} style={{ backgroundColor: skeletonBg }}></div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="rounded-3xl px-3 py-3 flex gap-3"
      style={{ backgroundColor: cardBg }}
    >
      <div
        className={`w-[80px] h-[80px] flex-shrink-0 rounded-2xl p-1 overflow-hidden`}
        style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#f3f3f3" }}
      >
        <img
          src={item.src}
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <h2 className={`text-[13px] line-clamp-1 mb-1 ${textColor}`}>
          {item.name}
        </h2>

        <div className="flex items-center space-x-1 my-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff7643">
            <path d="M12 2l2.9 6.1L22 9.3l-5 4.9 1.2 7-6.2-3.4-6.2 3.4 1.2-7-5-4.9 7.1-1.2L12 2z" />
          </svg>
          <span className="text-[13px] text-[#ff7643] font-medium">
            {item.rating}
          </span>
        </div>

        <p className={`text-[12px] leading-5 line-clamp-2 ${subTextColor}`}>
          {item.review}
        </p>
      </div>
    </article>
  );
}
