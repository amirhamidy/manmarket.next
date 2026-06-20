"use client";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LikeButton({ initialLiked = false }) {
    const [liked, setLiked] = useState(initialLiked);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked((prev) => !prev);

        toast.success(
            liked ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد",
            {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                theme: "dark",
                style: {
                    fontSize: "13px",
                    fontFamily: "inherit",
                    width: "95%",
                    maxWidth: "556px",
                    background: "#000000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                    margin: "4px auto",
                },
                icon: false,
            }
        );
    };

    return (
        <button
            onClick={handleLike}
            className="absolute top-1 right-0 w-6 h-6 flex items-center justify-center"
            aria-label={liked ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        >
            {liked ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M16.609,4.444a4.745,4.745,0,0,0-6.582-.157A4.773,4.773,0,0,0,3.444,11.2l6.583,6.583L16.611,11.2A4.729,4.729,0,0,0,16.609,4.444Z"
                        transform="translate(1.973 1.164)"
                        fill="#ef5350"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M16.609,4.444a4.745,4.745,0,0,0-6.582-.157A4.773,4.773,0,0,0,3.444,11.2l6.583,6.583L16.611,11.2A4.729,4.729,0,0,0,16.609,4.444Z"
                        transform="translate(1.973 1.164)"
                        fill="#757575"
                    />
                </svg>
            )}
        </button>
    );
}
