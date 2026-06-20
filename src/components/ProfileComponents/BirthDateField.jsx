"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const ArrowLeft = ({ onClick }) => (
    <button onClick={onClick} className="p-1">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </button>
);

const ArrowRight = ({ onClick }) => (
    <button onClick={onClick} className="p-1">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </button>
);

export default function BirthDateField({ value, onChange }) {
    const today = new Date();
    const maxYear = 1404;
    const { theme } = useTheme();
    const ref = useRef(null);

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState("day");
    const [selectedYear, setSelectedYear] = useState(maxYear);
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState(today.getDate());

    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split("-").map(Number);
            setSelectedYear(y > maxYear ? maxYear : y);
            setSelectedMonth(m - 1);
            setSelectedDay(d);
        }
    }, [value]);

    const years = [];
    for (let y = 1320; y <= maxYear; y++) years.push(y);

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const selectDay = (d) => {
        setSelectedDay(d);
        onChange(`${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
        setOpen(false);
    };

    const selectMonth = (m) => {
        setSelectedMonth(m);
        setStep("day");
    };

    const selectYear = (y) => {
        setSelectedYear(y);
        setStep("month");
    };

    const prevStep = () => {
        if (step === "day") setOpen(false);
        if (step === "month") setStep("year");
        if (step === "year") setStep("month");
    };

    const getLabel = () => {
        if (step === "day") return `${persianMonths[selectedMonth]} ${selectedYear}`;
        if (step === "month") return selectedYear;
        return "سال را انتخاب کنید";
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    const bgColor = theme === "dark" ? "#23262B" : "#fff";
    const borderColor = open ? "#ff7643" : theme === "dark" ? "#555" : "#c7c7c7";
    const textColor = theme === "dark" ? "#fff" : "#000";
    const labelColor = open ? "#ff7643" : theme === "dark" ? "#aaa" : "#757575";

    return (
        <div className="relative w-full" ref={ref}>
            <motion.label
                className="absolute left-[5%] px-1 pointer-events-none"
                animate={{
                    top: open || value ? -12 : "50%",
                    translateY: open || value ? 0 : "-50%",
                    fontSize: open || value ? "12px" : "16px",
                    color: labelColor,
                    backgroundColor: bgColor,
                }}
                transition={{ duration: 0.2 }}
            >
                تاریخ تولد
            </motion.label>

            <div
                onClick={() => setOpen(!open)}
                className={`h-[48px] px-6 flex items-center rounded-full border-2 cursor-pointer transition-colors`}
                style={{ backgroundColor: bgColor, borderColor: borderColor, color: textColor }}
            >
                <span className={`text-sm ${value ? textColor : "text-gray-400"}`}>
                    {value || ""}
                </span>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`absolute z-50 mt-2 w-full rounded-2xl shadow-xl p-4 ${theme === "dark" ? "bg-[#23262B]" : "bg-white"}`}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <ArrowLeft onClick={prevStep} />
                            <span className="text-gray-700 dark:text-gray-200 font-medium cursor-pointer" onClick={() => {
                                if (step === "day") setStep("month");
                                if (step === "month") setStep("year");
                            }}>
                                {getLabel()}
                            </span>
                            <ArrowRight onClick={() => {
                                if (step === "day") setStep("month");
                                if (step === "month") setStep("year");
                                if (step === "year") setStep("month");
                            }} />
                        </div>

                        {step === "day" && (
                            <div className="grid grid-cols-7 gap-2">
                                {days.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => selectDay(d)}
                                        className={`h-10 rounded-lg flex items-center justify-center ${d === selectedDay ? "bg-[#ff7643] text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                            } hover:bg-[#ff7643] hover:text-white transition`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === "month" && (
                            <div className="grid grid-cols-3 gap-2">
                                {persianMonths.map((m, i) => (
                                    <button
                                        key={m}
                                        onClick={() => selectMonth(i)}
                                        className={`h-10 rounded-lg flex items-center justify-center ${i === selectedMonth ? "bg-[#ff7643] text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                            } hover:bg-[#ff7643] hover:text-white transition`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}

                        {step === "year" && (
                            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                                {years.map(y => (
                                    <button
                                        key={y}
                                        onClick={() => selectYear(y)}
                                        className={`h-10 rounded-lg flex items-center justify-center ${y === selectedYear ? "bg-[#ff7643] text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                            } hover:bg-[#ff7643] hover:text-white transition`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
