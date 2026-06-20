"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashStep1 from "@/components/Slider/Splash/SplashStep1";
import SplashStep2 from "@/components/Slider/Splash/SplashStep2";
import SplashStep3 from "@/components/Slider/Splash/SplashStep3";
import SplashStep4 from "@/components/Slider/Splash/SplashStep4";

const MAX_STEP = 3;

export default function AllElStep() {
    const [currentStep, setCurrentStep] = useState(0);
    const [dragValue, setDragValue] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const rangeRef = useRef(null);

    const animateToStep = (from, to) => {
        if (isAnimating || from === to) return;
        setIsAnimating(true);
        const duration = 400;
        const start = performance.now();

        const animate = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = t < 0.5
                ? 2 * t * t
                : -1 + (4 - 2 * t) * t;
            const value = from + (to - from) * ease;
            setDragValue(value);
            if (t < 1) requestAnimationFrame(animate);
            else {
                setCurrentStep(to);
                setDragValue(to);
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);
    };

    const goNext = () => {
        if (currentStep < MAX_STEP) animateToStep(currentStep, currentStep + 1);
    };

    const handlePointerDown = (e) => {
        e.preventDefault();
        if (isAnimating || !rangeRef.current) return;

        const rect = rangeRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clickX = clientX - rect.left;
        const percent = clickX / rect.width;
        const clickedStep = Math.round(percent * MAX_STEP);

        if (clickedStep > currentStep)
            animateToStep(currentStep, Math.min(currentStep + 1, MAX_STEP));
        else if (clickedStep < currentStep)
            animateToStep(currentStep, Math.max(currentStep - 1, 0));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <SplashStep1 />;
            case 1:
                return <SplashStep2 />;
            case 2:
                return <SplashStep3 />;
            case 3:
                return <SplashStep4 />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="relative w-full max-w-[556px] h-[100dvh] mx-auto overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0.97, y: 2, filter: "blur(7px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0.97, y: -2, filter: "blur(7px)" }}
                        transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}
                        className="absolute inset-0"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="fixed left-1/2 bottom-11 flex justify-between items-center w-full max-w-[556px] -translate-x-1/2 z-50 px-6">
                <button onClick={goNext} className="text-white text-sm flex justify-center">
                    بعدی
                </button>
                <input
                    ref={rangeRef}
                    type="range"
                    min={0}
                    max={MAX_STEP}
                    step={0.01}
                    value={dragValue}
                    onMouseDown={handlePointerDown}
                    onTouchStart={handlePointerDown}
                    onChange={() => { }}
                    className={`w-24 h-1.5 appearance-none rounded-full cursor-pointer transition-colors ${currentStep === 3 ? "bg-orange-100" : "bg-white"
                        }`}
                    style={{ WebkitAppearance: "none", direction: "ltr" }}
                />
                <style jsx>{`
                    input[type="range"]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        background: ${currentStep === 3 ? "#ff7643" : "#fff7f4"};
                        box-shadow: 0 4px 6px rgba(255, 118, 67, 0.3);
                        cursor: pointer;
                        transition: transform 0.25s ease, background 0.3s ease;
                    }
                    input[type="range"]::-moz-range-thumb {
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        background: ${currentStep === 3 ? "#ff7643" : "#fff7f4"};
                        border: none;
                        box-shadow: 0 4px 6px rgba(255, 118, 67, 0.3);
                        cursor: pointer;
                    }
                `}</style>
            </div>
        </>
    );
}
