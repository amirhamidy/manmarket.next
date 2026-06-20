"use client";

import Image from "next/image";

export default function SplashStep3() {
    return (
        <div className="w-full min-h-screen flex justify-center">
            <div className="relative w-full max-w-[550px] h-[100vh] overflow-hidden">
                <Image
                    src="/assets/img/bg-img-3.jpg"
                    alt="تصویر محصولات با کیفیت"
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
                    <p className="text-white text-[18px] leading-relaxed text-center">
                       انتخاب هوشمند
                        <br />
                        تحویل سریع
                        <br />
                        پرداخت اقساطی
                    </p>
                </div>
            </div>
        </div>
    );
}
