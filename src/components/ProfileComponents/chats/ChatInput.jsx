"use client";

import { AttachIcon } from "@/components/icons/AttachIcon";
import { SendIcon } from "@/components/icons/SendIcon";
import { useRef, useState, useLayoutEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const BASE_HEIGHT = 40;
const MAX_HEIGHT = 80;

export default function ChatInput({ onSend }) {
    const { theme } = useTheme();
    const [text, setText] = useState("");
    const textareaRef = useRef(null);
    const fileRef = useRef();

    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        if (text.length === 0) {
            el.style.height = BASE_HEIGHT + "px";
            return;
        }
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + "px";
    }, [text]);

    const sendText = () => {
        if (!text.trim()) return;
        onSend({ type: "text", text });
        setText("");
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith("video") ? "video" : "image";
        onSend({ type, url });
        fileRef.current.value = "";
    };

    const inputBg = theme === "dark" ? "#23262B" : "#ffffff";
    const textareaBg = theme === "dark" ? "#1A1A1A" : "#f3f3f3";
    const textColor = theme === "dark" ? "text-white" : "text-gray-900";
    const attachBg = theme === "dark" ? "#333" : "#e5e5e5";

    return (
        <div
            className={`px-3 py-1 flex items-center gap-1 rounded-4xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)]`}
            style={{ backgroundColor: inputBg }}
        >
            <button
                onClick={sendText}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff7643]"
            >
                <SendIcon />
            </button>

            <input
                type="file"
                accept="image/*,video/*"
                hidden
                ref={fileRef}
                onChange={handleFile}
            />
            <div className="flex-1">
                <textarea
                    ref={textareaRef}
                    dir="rtl"
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="پیام خود را بنویسید"
                    className={`w-full resize-none mt-2 outline-none text-sm text-right rounded-2xl px-4 py-2 leading-5 overflow-y-auto scrollbar-hide ${textColor}`}
                    style={{ height: BASE_HEIGHT, backgroundColor: textareaBg }}
                />
            </div>
            <button
                onClick={() => fileRef.current.click()}
                className="w-10 h-10 flex items-center justify-center rounded-full transition"
                style={{ backgroundColor: attachBg }}
            >
                <AttachIcon />
            </button>
        </div>
    );
}
