"use client";

import Image from "next/image";

export default function SplashStep1() {
    return (
        <div className="w-full min-h-screen flex justify-center">
            <div className="relative w-full max-w-[550px] h-[100vh] overflow-hidden">
                <Image
                    src="/assets/img/bg-img-1.jpg"
                    alt="تصویر خوش‌آمد کاربر"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2">
                    <div className=" rounded-3xl flex items-center justify-center drop-shadow-lg">
                        <Image
                            src="/logo.png"
                            alt="لوگو Man Market"
                            width={120}
                            height={120}
                        />
                    </div>
                </div>
                <div className="absolute top-[52%] left-1/2 -translate-x-1/2 text-center px-6">
                    <p className="text-white font-bold text-[24px] leading-relaxed">من مارکت </p>
                </div>

            </div>
        </div>
    );
}
