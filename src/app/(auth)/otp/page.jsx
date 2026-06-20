"use client";

import OtpInput from "@/components/OtpInput";


export default function OtpPage() {
    return (
        <main className="min-h-screen bg-white flex justify-center items-center">
            <section className="w-full max-w-[556px] pt-16 space-y-6">

                <header>
                    <h1 className="text-[16px] text-[#757575]">
                        کد تأیید ارسال‌شده
                    </h1>
                </header>

                <OtpInput
                    onComplete={(code) => {
                        console.log("OTP Code:", code);
                    }}
                />

                <button
                    className="
                        w-full h-[48px]
                        rounded-full
                        bg-[#ff7643]
                        text-[14px]
                        text-[#fff7f4]
                        hover:brightness-95
                        transition
                    "
                >
                    تأیید
                </button>

                <p className="text-[13px] text-[#757575] text-center">
                    کد را دریافت نکردید؟
                    <span className="text-[#ff7643] cursor-pointer mr-1">
                        ارسال مجدد
                    </span>
                </p>

            </section>
        </main>
    );
}
