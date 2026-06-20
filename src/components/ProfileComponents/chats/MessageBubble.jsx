"use client";

import { useTheme } from "@/context/ThemeContext";

export default function MessageBubble({ message }) {
    const { theme } = useTheme();
    const isMe = message.fromMe;
    const meBg = "#FF7643";
    const meText = "text-white";
    const otherBg = theme === "dark" ? "#23262B" : "#ffffff";
    const otherText = theme === "dark" ? "text-white" : "text-gray-900";
    const otherShadow = theme === "dark" ? "shadow-none" : "shadow-[0_1px_3px_rgba(0,0,0,0.08)]";

    return (
        <div className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
            <div
                className={`max-w-[78%] px-3 py-2 rounded-2xl text-[14px] leading-6 
                    ${isMe
                        ? `bg-[${meBg}] ${meText} rounded-tr-md`
                        : `bg-[${otherBg}] ${otherText} rounded-tl-md ${otherShadow}`
                    }`}
            >
                {message.type === "text" && (
                    <p className="whitespace-pre-wrap text-right">
                        {message.text}
                    </p>
                )}

                {message.type === "image" && (
                    <img
                        src={message.url}
                        className="rounded-xl max-h-64 object-cover"
                    />
                )}

                {message.type === "video" && (
                    <video
                        src={message.url}
                        controls
                        className="rounded-xl max-h-64"
                    />
                )}
            </div>
        </div>
    );
}
