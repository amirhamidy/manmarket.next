"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashStep4() {
    const router = useRouter();

    const handleFinish = (path) => {
        localStorage.setItem("hasVisitedWelcome", "true");

        router.replace(path);
    };

    return (
        <div className="w-full min-h-screen flex justify-center">
            <div className="relative w-full max-w-[550px] h-[100vh] overflow-hidden">
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 bg-[#ff7643] rounded-2xl">
                    <div className="p-5 rounded-3xl flex flex-col items-center justify-center drop-shadow-lg">
                        <Image
                            src="/logo.png"
                            alt="لوگو Man Market"
                            width={120}
                            height={120}
                        />
                        <span className="text-white text-sm mt-3 font-semibold">
                            Man Market
                        </span>
                    </div>
                </div>

                <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[334px] max-w-[85%]">
                    <button
                        onClick={() => handleFinish("/")}
                        className="w-full h-12 rounded-[24px] bg-[#ff7643] flex items-center justify-center"
                    >
                        <span className="text-[#fff7f4] text-sm">شروع خرید</span>
                    </button>
                </div>

                <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[334px] max-w-[85%]">
                    <button
                        onClick={() => handleFinish("/login")}
                        className="w-full h-12 rounded-[24px] border-2 border-[#ff7643] flex items-center justify-center"
                    >
                        <span className="text-[#ff7643] text-sm">
                            ورود // ثبت نام
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
