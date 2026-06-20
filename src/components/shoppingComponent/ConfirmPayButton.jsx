"use client";

import React from "react";

/**
 * ConfirmPayButton
 *
 * دکمه‌ای برای تایید و پرداخت سفارش
 *
 * Props:
 * - onClick: تابعی که هنگام کلیک اجرا می‌شود
 * - disabled: غیرفعال کردن دکمه (اختیاری)
 * - loading: نمایش حالت لودینگ (اختیاری)
 */
export default function ConfirmPayButton({ onClick, disabled = false, loading = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                max-w-[556px] h-[48px] w-full
                rounded-[24px]
                bg-[#ff7643]
                text-[#fff7f4] text-[14px] font-medium
                transition-all duration-200 ease-out
                hover:brightness-95
                focus-visible:ring-2 focus-visible:ring-[#ff7643]/40
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
            `}
        >
            {loading ? (
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
            ) : null}

            <span>{loading ? "در حال پردازش..." : "تایید و پرداخت"}</span>
        </button>
    );
}