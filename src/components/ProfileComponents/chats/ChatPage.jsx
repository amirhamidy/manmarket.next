"use client";

import { useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import MainHeader from "@/base/mainHeader";
import { useTheme } from "@/context/ThemeContext";

export default function ChatPage() {
    const { theme } = useTheme();
    const pageBg = theme === "dark" ? "#000" : "#f5f5f5";
    const headerBg = theme === "dark" ? "#23262B" : "#ffffff";
    const headerText = theme === "dark" ? "text-white" : "text-gray-900";
    const shadow = theme === "dark" ? "shadow-none" : "shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

    const [messages, setMessages] = useState([
        { id: 1, type: "text", text: "سلام 👋", fromMe: false },
        { id: 2, type: "text", text: "سلام، وقت بخیر", fromMe: true },
    ]);

    return (
        <div dir="rtl" className={`max-w-[556px] mx-auto min-h-screen flex flex-col px-3 p-2`} style={{ backgroundColor: pageBg }}>
            <div className={`h-14 px-4 rounded-4xl flex items-center justify-between gap-3 z-10 sticky top-1`} style={{ backgroundColor: headerBg }}>
                <div className="flex justify-center gap-2 items-center">
                    <img
                        src="/assets/img/white-logo.png"
                        alt="پشتیبانی"
                        className="w-9 h-9 rounded-full object-contain bg-[#ff7643] p-1"
                    />
                    <div className="flex flex-col">
                        <span className={`text-[14px] font-medium ${headerText}`}>
                            پشتیبانی من مارکت
                        </span>
                    </div>
                </div>
                <MainHeader />
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
                {messages.map(m => (
                    <MessageBubble key={m.id} message={m} />
                ))}
            </div>

            <div className="sticky bottom-0">
                <ChatInput
                    onSend={(msg) =>
                        setMessages(prev => [...prev, { ...msg, id: Date.now(), fromMe: true }])
                    }
                />
            </div>
        </div>
    );
}
