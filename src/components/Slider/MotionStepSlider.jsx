"use client";
import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

const STEPS = 4;
const TRACK_WIDTH = 96; 

export default function MotionStepSlider({ step, onChange }) {
    const trackRef = useRef(null);
    const x = useMotionValue(0);

    const stepWidth = TRACK_WIDTH / (STEPS - 1);

    useEffect(() => {
        x.set(step * stepWidth);
    }, [step]);

    const handleDragEnd = (_, info) => {
        const rect = trackRef.current.getBoundingClientRect();
        const raw = info.point.x - rect.left;
        const index = Math.round(raw / stepWidth);
        onChange(Math.max(0, Math.min(STEPS - 1, index)));
    };

    return (
        <div ref={trackRef} className="relative w-24 h-2 bg-zinc-200 rounded-full">
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: TRACK_WIDTH }}
                dragElastic={0.25}
                onDragEnd={handleDragEnd}
                animate={{ x: step * stepWidth }}
                transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 26,
                }}
                className="absolute -top-2 w-6 h-6 rounded-full bg-[#fff7f4] shadow-md cursor-pointer"
                style={{ x }}
            />
        </div>
    );
}
