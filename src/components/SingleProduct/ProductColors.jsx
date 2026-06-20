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
                                className="w-9 h-9 rounded-full bg-gray-300 animate-pulse"
                            />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <p className="text-[13px] text-[#757575] text-right">
                        رنگ :
                    </p>

                    <div className="flex flex-wrap gap-3 justify-start">
                        {colors.map((item, index) => {
                            const hexColor =
                                item.hex_color ||
                                item.color?.hex_color ||
                                "#000000";

                            const isActive = selectedColor === index;

                            return (
                                <button
                                    key={item.id || index}
                                    type="button"
                                    aria-label={`انتخاب رنگ ${item.color?.title || ""}`}
                                    onClick={() => onSelect(index)}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition
                                        ${isActive
                                            ? "border-2 border-[#ff7643]"
                                            : "border-2 border-[#ededed]"
                                        }`}
                                >
                                    <span
                                        className="w-6 h-6 rounded-full block"
                                        style={{ backgroundColor: hexColor }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
}
