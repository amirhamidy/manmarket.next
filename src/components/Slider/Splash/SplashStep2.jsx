"use client";

import Image from "next/image";

export default function SplashStep2() {
    return (
        <div className="w-full min-h-screen flex justify-center">
            <div className="relative w-full max-w-[550px] h-[100vh] overflow-hidden">
                <Image
                    src="/assets/img/bg-img-2.jpg"
                    alt="تصویر محصولات جدید"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2">
                    <div className="rounded-3xl flex flex-col items-center justify-center drop-shadow-lg">
                        <Image
                            src="/logo.png"
                            alt="لوگو Man Market"
                            width={120}
                            height={120}
                        />
                    </div>
                </div>
                <div className="absolute top-[62%] left-1/2 -translate-x-1/2 text-center px-6">
                    <p className="text-white text-[18px] text-nowrap leading-relaxed text-center">
                        خوش آمدید، به تجربه ی نو از خرید آنلاین
                        <br />
                    </p>
                </div>
            </div>
        </div>
    );
}
