"use client";

import { useEffect, useState } from "react";

export default function ProductColors({
  colors = [],
  selectedColor = 0,
  onSelect,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (!loading && (!Array.isArray(colors) || colors.length === 0)) return null;

  return (
    <section className="mb-8 flex justify-start items-center gap-2">
      {loading ? (
        <>
          <div className="w-12 h-4 rounded-md bg-gray-300 animate-pulse" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-8 rounded-full bg-gray-300 animate-pulse"
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-[13px] text-[#757575] text-right">رنگ :</p>

          <div className="flex flex-wrap gap-2 justify-start">
            {colors.map((item, index) => {
              const colorName = item.color?.title || item.title || "نامشخص";

              const isActive = selectedColor === index;

              return (
                <button
                  key={item.id || index}
                  type="button"
                  aria-label={`انتخاب رنگ ${colorName}`}
                  onClick={() => onSelect(index)}
                  className={`px-4 py-1.5 rounded-full text-[13px] transition border-2
                                        ${
                                          isActive
                                            ? "border-[#ff7643] text-[#ff7643] font-medium"
                                            : "border-[#ededed] text-[#757575]"
                                        }`}
                >
                  {colorName}
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
