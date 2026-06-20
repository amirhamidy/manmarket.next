"use client";
import React from "react";

const tabs = [
    { id: "awaiting_payment", label: "Awaiting Payment" },
    { id: "awaiting_confirmation", label: "Awaiting Confirmation" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
];

export default function OrdersTabs({ activeTab, onChange }) {
    return (
        <div className="overflow-x-auto px-4 py-4">
            <div className="flex gap-2 relative">
                {tabs.map((tab, idx) => (
                    <div key={tab.id} className="relative flex-shrink-0">
                        {/* Active Background */}
                        {activeTab === tab.id && (
                            <div
                                className={`
                  absolute -top-2 left-0 right-0 h-full rounded-[24px] bg-[#ededed] z-0
                  transition-all duration-200
                `}
                            />
                        )}
                        {/* Tab Text */}
                        <button
                            onClick={() => onChange(tab.id)}
                            className={`
                relative z-10 px-5 py-2 min-w-[120px] text-[16px] font-medium
                text-center
                ${activeTab === tab.id ? "text-[#757575]" : "text-[#c7c7c7]"}
              `}
                        >
                            {tab.label}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
