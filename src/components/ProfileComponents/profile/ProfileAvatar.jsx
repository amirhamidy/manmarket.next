"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileAvatar() {
    const { api, user, setUser } = useAuth();
    const defaultImage = "/avatar-default.png";

    const [image, setImage] = useState(user?.image || defaultImage);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        const loadImage = (src) => {
            setLoadingImage(true);

            const img = new window.Image();
            img.src = src;

            img.onload = () => {
                setImage(src);
                setLoadingImage(false);
            };

            img.onerror = () => {
                setImage(defaultImage);
                setLoadingImage(false);
            };
        };

        if (!user?.image) {
            const fetchProfileImage = async () => {
                try {
                    const res = await api.get("/accounts/v1/profile/");
                    const serverImage = res.data.image || defaultImage;
                    loadImage(serverImage);
                } catch (err) {
                    console.error("خطا در دریافت عکس پروفایل", err);
                    loadImage(defaultImage);
                }
            };

            fetchProfileImage();
        } else {
            loadImage(user.image);
        }
    }, [api, user]);

    const handleChangeAvatar = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setLoadingUpload(true);

        try {
            const res = await api.put(
                "/accounts/v1/profile/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const newImage = res.data.image || defaultImage;

            const img = new window.Image();
            img.src = newImage;

            img.onload = () => {
                setImage(newImage);
                setLoadingUpload(false);

                if (setUser) {
                    setUser(prev => ({ ...prev, image: newImage }));
                }
            };

            img.onerror = () => {
                setImage(defaultImage);
                setLoadingUpload(false);
            };

        } catch (err) {
            console.error("خطا در آپلود عکس پروفایل", err);
            setLoadingUpload(false);
        }
    };

    const showSpinner = loadingUpload || loadingImage;

    return (
        <section className="relative mt-3 flex justify-center">
            <div className="relative p-0.5 w-22 h-22 bg-[rgb(255,118,67)] rounded-full flex items-center justify-center">

                <img
                    src={image}
                    alt="Profile"
                    className={`w-20 h-20 object-contain bg-[rgb(255,118,67)] rounded-full ${showSpinner ? "opacity-50" : ""}`}
                />

                {showSpinner && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                <label
                    className="absolute bottom-0 left-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer"
                    style={{ transform: "translate(65%, 50%)" }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14.4" viewBox="0 0 16 14.4">
                        <g transform="translate(-2 -2)">
                            <path d="M11.2,8a3.2,3.2,0,1,0,3.2,3.2A3.243,3.243,0,0,0,11.2,8Zm0,4.8a1.6,1.6,0,1,1,1.6-1.6A1.642,1.642,0,0,1,11.2,12.8Z" transform="translate(-1.2 -1.2)" fill="#757575"/>
                            <path d="M16.4,4.4H14.331L12.166,2.234A.8.8,0,0,0,11.6,2H8.4a.8.8,0,0,0-.566.234L5.669,4.4H3.6A1.6,1.6,0,0,0,2,6v8.8a1.6,1.6,0,0,0,1.6,1.6H16.4A1.6,1.6,0,0,0,18,14.8V6A1.6,1.6,0,0,0,16.4,4.4ZM3.6,14.8V6H6a.8.8,0,0,0,.566-.234L8.731,3.6h2.538l2.166,2.166A.8.8,0,0,0,14,6h2.4v8.8Z" fill="#757575"/>
                        </g>
                    </svg>

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChangeAvatar}
                        disabled={loadingUpload}
                    />
                </label>

            </div>
        </section>
    );
}
