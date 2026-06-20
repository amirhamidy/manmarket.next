"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const EyeIcon = ({ color = "#ff7643" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = ({ color = "#ff7643" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 12s3.5-7 10-7c2.2 0 4.1.6 5.7 1.6" />
        <path d="M22 12s-3.5 7-10 7c-2.2 0-4.1-.6-5.7-1.6" />
        <path d="M9.9 9.9a3 3 0 004.2 4.2" />
        <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
);

const BackIcon = ({ color = "#757575" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="13.393" viewBox="0 0 16 13.393">
        <path d="M18.586,10.121H5.912l4.6-4.6L9.283,4.293l-6.7,6.7,6.7,6.7,1.229-1.229-4.6-4.6H18.586Z" transform="translate(-2.586 -4.293)" fill={color} />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M5 12l4 4L19 7" />
    </svg>
);

export default function LoginStep() {
    const { login, register } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [focused, setFocused] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isFloating = (v, n) => focused === n || v.length > 0;

    const passwordRules = {
        length: password.length >= 8,
        upperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
        number: /[0-9]/.test(password),
        special: /[@#!%$^&*]/.test(password),
    };

    const allValid = Object.values(passwordRules).every(Boolean);

    const nextStep = e => {
        e.preventDefault();
        if (number.length !== 11) {
            toast.error("شماره وارد شده کامل نیست");
            return;
        }
        setStep(2);
    };

    const submitFinal = async () => {
        if (!allValid) return;
        setLoading(true);
        try {
            await login({ phone_number: number, password });
            router.push("/login/successfull");
        } catch {
            try {
                await register({ phone_number: number, password, password1: password });
                await login({ phone_number: number, password });
                router.push("/login/successfull");
            } catch {
                toast.error("ورود یا ثبت‌نام ناموفق بود");
                router.push("/login/failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center px-4">
            <section className="w-full max-w-[556px] pt-16 space-y-6">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            onSubmit={nextStep}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-end">
                                <button type="button" onClick={() => router.back()}><BackIcon /></button>
                            </div>

                            <div className="relative">
                                <input
                                    type="tel"
                                    value={number}
                                    onChange={e => setNumber(e.target.value)}
                                    onFocus={() => setFocused("number")}
                                    onBlur={() => setFocused(null)}
                                    className={`w-full h-[48px] px-6 rounded-full border-2 outline-none text-right bg-transparent ${isFloating(number, "number") ? "border-[#ff7643]" : "border-[#c7c7c7]"} text-black dark:text-white`}
                                    maxLength={11}
                                />
                                <motion.label
                                    className="absolute left-6 px-1 bg-white dark:bg-gray-900"
                                    animate={{
                                        top: isFloating(number, "number") ? -10 : "50%",
                                        translateY: isFloating(number, "number") ? 0 : "-50%",
                                        fontSize: isFloating(number, "number") ? "12px" : "14px",
                                        color: isFloating(number, "number") ? "#ff7643" : "rgba(117,117,117,0.6)",
                                    }}
                                >
                                    شماره همراه
                                </motion.label>
                            </div>

                            <button className="w-full h-[48px] rounded-full bg-[#ff7643] text-white">ادامه</button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center text-[13px]">
                                <div className="space-y-1">
                                    {[
                                        ["حداقل 8 کاراکتر", passwordRules.length],
                                        ["حروف بزرگ و کوچک", passwordRules.upperLower],
                                        ["شامل عدد", passwordRules.number],
                                        ["کاراکتر خاص (@ # ! %)", passwordRules.special],
                                    ].map(([t, ok]) => (
                                        <div key={t} className={`flex justify-start gap-2 ${ok ? "opacity-100" : "opacity-50"}`}>
                                             {ok && <CheckIcon />}
                                            <span className="text-start">{t}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setStep(1)}><BackIcon /></button>
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused(null)}
                                    className={`w-full h-[48px] px-12 rounded-full border-2 outline-none bg-transparent ${isFloating(password, "password") ? "border-[#ff7643]" : "border-[#c7c7c7]"} text-black dark:text-white`}
                                />
                                <motion.label
                                    className="absolute left-6 px-1 bg-white dark:bg-gray-900"
                                    animate={{
                                        top: isFloating(password, "password") ? -10 : "50%",
                                        translateY: isFloating(password, "password") ? 0 : "-50%",
                                        fontSize: isFloating(password, "password") ? "12px" : "14px",
                                        color: isFloating(password, "password") ? "#ff7643" : "rgba(117,117,117,0.6)",
                                    }}
                                >
                                    رمز عبور
                                </motion.label>
                                {password && (
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={submitFinal}
                                disabled={!allValid || loading}
                                className="w-full h-[48px] rounded-full bg-[#ff7643] text-white flex justify-center items-center disabled:opacity-50"
                            >
                                {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "ورود"}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <ToastContainer />
            </section>
        </main>
    );
}