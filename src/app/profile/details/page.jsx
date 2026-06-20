"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainHeader from "@/base/mainHeader";
import Navbar from "@/base/navbar";
import BirthDateField from "@/components/ProfileComponents/BirthDateField";
import FloatingField from "@/components/ProfileComponents/FloatingField";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export default function MyDetailsPage() {
    const { theme } = useTheme();
    const { accessToken, api, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [number, setNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        if (!authLoading && accessToken) {
            const fetchProfile = async () => {
                try {
                    const res = await api.get("/accounts/v1/profile/");
                    const data = res.data;
                    setFirstName(data.first_name || "");
                    setLastName(data.last_name || "");
                    setNumber(data.phone_number || "");
                    setBirthDate(data.birth_date || "");
                } catch (err) {
                    console.error("خطا در دریافت پروفایل:", err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        } else if (!accessToken) {
            setLoading(false);
        }
    }, [authLoading, accessToken, api]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.patch("/accounts/v1/profile/", {
                first_name: firstName,
                last_name: lastName,
                birth_date: birthDate,
            });
            setToastMessage("تغییرات با موفقیت اعمال شد");
            setTimeout(() => setToastMessage(""), 3000);
        } catch (err) {
            console.error("خطا در ذخیره پروفایل:", err.message);
            setToastMessage("ذخیره تغییرات با مشکل مواجه شد");
            setTimeout(() => setToastMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const inputBg = theme === "dark" ? "#23262B" : "#ffffff";
    const inputBorder = theme === "dark" ? "border-gray-600" : "border-gray-300";
    const inputText = theme === "dark" ? "text-gray-100" : "text-gray-900";

    return (
        <div className="flex justify-center relative">
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 20, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                        className={`fixed top-0 left-1/2 -translate-x-1/2 z-[999999] w-[90%] max-w-[520px] px-4 py-3 rounded-xl text-[13px] font-medium shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${theme === "dark" ? "bg-white text-black" : "bg-[#ff7643] text-white"
                            }`}
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <main
                className={`flex flex-col min-h-screen w-full max-w-[556px] items-center ${theme === "dark" ? "bg-[#000] text-white" : "bg-white text-gray-900"
                    }`}
            >
                <div className="w-full text-end">
                    <MainHeader />
                </div>

                <section className="w-full px-2 mt-10 space-y-5">
                    {loading || authLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-11 w-full rounded-3xl bg-gray-200 dark:bg-gray-700 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <FloatingField
                                id="firstName"
                                label="نام"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={`h-11 w-full px-4 rounded-3xl border-2 outline-none  ${inputBg} ${inputBorder} ${inputText}`}
                                labelClass={`${inputText}`}
                                alwaysAbove
                            />
                            <FloatingField
                                id="lastName"
                                label="نام خانوادگی"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={`h-11 w-full px-4 rounded-3xl border-2 outline-none  ${inputBg} ${inputBorder} ${inputText}`}
                                labelClass={`${inputText}`}
                                alwaysAbove
                            />
                            <FloatingField
                                id="number"
                                label="شماره همراه"
                                value={number}
                                type="text"
                                disabled
                                className={`h-11 w-full px-4 rounded-3xl border-2 outline-none  ${inputBg} ${inputBorder} ${inputText} cursor-not-allowed`}
                                labelClass={`${inputText}`}
                                alwaysAbove
                            />
                            <BirthDateField
                                value={birthDate}
                                onChange={setBirthDate}
                                inputClass={`h-11 w-full px-4 rounded-3xl border-2 outline-none  ${inputBg} ${inputBorder} ${inputText}`}
                                labelClass={`${inputText}`}
                                alwaysAbove
                            />
                            <button
                                onClick={handleSave}
                                className={`w-full h-[48px] rounded-full text-[14px] transition  ${theme === "dark"
                                        ? "bg-[#23262B] text-[#ff7643]"
                                        : "bg-[#ff7643] text-white"
                                    }`}
                            >
                                ذخیره تغییرات
                            </button>
                        </>
                    )}
                </section>
                <Navbar />
            </main>
        </div>
    );
}