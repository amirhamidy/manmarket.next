"use client";

import Link from "next/link";

export default function Custom404() {
    return (
        <main className="min-h-screen max-w-[556px] w-full mx-auto flex flex-col items-center justify-center p-4 relative">
            <section className="flex flex-col items-center">
                <div className="text-[28px] font-bold text-[#ff7643]">
                    ! 404
                </div>
                <div className="text-center mb-2 text-[22px] text-gray-700">
                    صفحه مورد نظر پیدا نشد!
                </div>
                <div className="text-center text-[14px] text-[#ff7643]">
                    <span>متاسفیم، صفحه‌ای که دنبال آن بودید وجود ندارد</span>
                </div>
            </section>

            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[999]">
                <Link href="/" className="w-[334px] h-[48px] flex items-center justify-center rounded-[24px] bg-[#ff7643] text-white text-[14px] font-semibold hover:bg-[#ff6333] transition">
                    بازگشت به صفحه اصلی
                </Link>
            </div>
        </main>
    );
}
