"use client";

import Link from "next/link";

export default function LoginSuccessful() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center  p-4 relative">
            <section className="flex flex-col items-center max-w-[556px] w-full">
                <div className="w-[242px] h-[183px] mb-6 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="242"
                        height="183"
                        viewBox="0 0 242 183"
                    >
                        <g transform="translate(89)">
                            <path
                                d="M34,2A32,32,0,1,0,66,34,32.036,32.036,0,0,0,34,2Zm0,57.6A25.6,25.6,0,1,1,59.6,34,25.63,25.63,0,0,1,34,59.6Z"
                                transform="translate(-2 -2)"
                                fill="#66bb6a"
                            />
                            <path
                                d="M17.792,24.7,10.665,17.59l-4.377,4.39L17.8,33.465,38.587,12.676,34.2,8.293Z"
                                transform="translate(7.9 12.275)"
                                fill="#66bb6a"
                            />
                        </g>
                    </svg>
                </div>

                <div className="text-center mb-2 text-[18px] text-gray-700">پرداخت موفقیت آمیز بود</div>
                <div className="text-center text-[13px] text-[#ff7643]"> امیدواریم که تجربه ی خوبی برای شما باشد </div>
            </section>

            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[999]">
                <Link href="/" className="w-[334px] h-[48px] flex items-center justify-center rounded-[24px] bg-[#ff7643] text-white text-[14px] font-semibold hover:bg-[#ff6333] transition">
                    شروع خرید
                </Link>
            </div>
        </main>
    );
}
