"use client";

import { useRef, useState } from "react";

export default function OtpInput({ length = 6, onComplete }) {
    const [values, setValues] = useState(Array(length).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);

        if (value && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }

        const code = newValues.join("");
        if (code.length === length && !code.includes("") && onComplete) {
            onComplete(code);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !values[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div dir="ltr" className="flex justify-center gap-3">
            {values.map((value, index) => (
                <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="
                        w-[48px] h-[48px]
                        text-center
                        rounded-[16px]
                        border-2
                        text-[18px]
                        text-[#757575]
                        outline-none
                        transition-all
                        bg-white
                        focus:border-[#ff7643]
                        border-[#ededed]
                    "
                />
            ))}
        </div>
    );
}
