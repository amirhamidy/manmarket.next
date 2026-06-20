"use client";

import { useTheme } from "@/context/ThemeContext";

const STEPS = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
    title: "ثبت درخواست",
    desc: "اطلاعات هویتی و مالی خود را در اپلیکیشن وارد کنید",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "بررسی اعتبار",
    desc: "درخواست شما توسط سیستم هوشمند ارزیابی می‌شود",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "تایید نهایی",
    desc: "مدارک شما تایید و قرارداد آماده امضا می‌شود",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
    title: "امضای قرارداد",
    desc: "قرارداد را به‌صورت آنلاین مطالعه و تایید کنید",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "واریز وجه",
    desc: "مبلغ تسهیلات مستقیم به حساب شما واریز می‌شود",
  },
];

export default function LoanTimeline() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div dir="rtl" className="w-full max-w-[556px] mx-auto px-3 py-5">
      <p
        className="text-xs font-medium mb-4"
        style={{ color: dark ? "#9ca3af" : "#6b7280" }}
      >
        مراحل دریافت تسهیلات
      </p>

      <div
        className="rounded-3xl p-5"
        style={{
          backgroundColor: dark ? "#1e1f22" : "#f9fafb",
          border: `1px solid ${dark ? "#2a2b2e" : "#e5e7eb"}`,
        }}
      >
        {STEPS.map((step, i) => (
          <div key={i} className="flex gap-4">
            {/* Left: icon + connector */}
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: dark ? "#2a2b2e" : "#f3f4f6",
                  color: dark ? "#9ca3af" : "#6b7280",
                }}
              >
                {step.icon}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-px flex-1 my-2"
                  style={{ backgroundColor: dark ? "#2a2b2e" : "#e5e7eb" }}
                />
              )}
            </div>

            {/* Right: text */}
            <div
              className={`pb-${i < STEPS.length - 1 ? "5" : "0"} pt-1`}
              style={{ paddingBottom: i < STEPS.length - 1 ? "20px" : "0" }}
            >
              <p
                className="text-sm font-bold mb-0.5"
                style={{ color: dark ? "white" : "#111827" }}
              >
                {step.title}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: dark ? "#9ca3af" : "#6b7280" }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
