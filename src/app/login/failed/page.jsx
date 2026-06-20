"use client";

import Link from "next/link";

export default function LoginFailed() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center max-w-[556px] w-full mx-auto p-4 relative">
            <section className="flex flex-col items-center">
                <div className="w-[274px] h-[201px] mb-6 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="274"
                        height="201"
                        viewBox="0 0 274 201"
                    >
                        <g transform="translate(105)">
                            <path
                                d="M12.141,34.058l8.767-8.767,8.767,8.767,4.383-4.383-8.767-8.767,8.767-8.767L29.675,7.758l-8.767,8.767L12.141,7.758,7.758,12.141l8.767,8.767L7.758,29.675Z"
                                transform="translate(11.092 11.092)"
                                fill="#ef5350"
                            />
                            <path
                                d="M34,66A32,32,0,1,0,2,34,32.036,32.036,0,0,0,34,66ZM34,8.4A25.6,25.6,0,1,1,8.4,34,25.63,25.63,0,0,1,34,8.4Z"
                                transform="translate(-2 -2)"
                                fill="#ef5350"
                            />
                        </g>
                    </svg>
                </div>

                <div className="text-center mb-2 text-[32px] text-gray-700">ورود ناموفق بود</div>
                <div className="text-center text-[14px] text-[#ff7643]">
                    <span>متاسفیم، اطلاعات شما تایید نشد</span>
                    <br />
                    <span>لطفاً دوباره تلاش کنید</span>
                </div>
            </section>

            <Link href="/" className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[999]">
                <button className="w-[334px] h-[48px] flex items-center justify-center rounded-[24px] border-2 border-[#ff7643] text-[#ff7643] text-[14px] font-semibold hover:bg-[#ff7643]/10 transition">
                    رد شدن و شروع خرید
                </button>
            </Link>
        </main>
    );
}
