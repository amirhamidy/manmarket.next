"use client";

import { useEffect, useState } from "react";
import PriceIcon from "@/components/icons/priceIcon";
import MainHeader from "@/base/mainHeader";

function CardSelectorSkeleton() {
    return (
        <div className="flex justify-center px-2 w-full items-center flex-col animate-pulse">
            <div className="max-w-[556px] w-full">
            </div>

            <div className="w-full max-w-[556px] items-center flex justify-center flex-col min-h-[70vh]">
                <div className="flex flex-col gap-4">
                    <div className="w-[334px] h-[200px] rounded-[24px] bg-gray-200 flex flex-col justify-around px-5">
                        <div className="flex justify-between items-center">
                            <div className="h-3 w-24 bg-gray-300 rounded" />
                            <div className="h-3 w-20 bg-gray-300 rounded" />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-3 w-16 bg-gray-300 rounded" />
                            <div className="flex gap-2 items-center">
                                <div className="h-3 w-20 bg-gray-300 rounded" />
                                <div className="w-4 h-4 bg-gray-300 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CardSelector() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <CardSelectorSkeleton />;
    }

    return (
        <div className="flex justify-center px-2 w-full items-center flex-col">
            <div className="max-w-[556px] w-full">
                <MainHeader />
            </div>

            <div className="w-full max-w-[556px] items-center flex justify-center flex-col min-h-[70vh]">
                <div className="flex flex-col gap-4">
                    <div className="w-[334px] h-[200px] rounded-[24px] bg-[url('/assets/img/one-wallet.png')] bg-cover bg-center cursor-pointer transition-all duration-300 relative flex justify-around items-center flex-col">
                        <div className="flex justify-between px-5 items-center w-full text-white text-[13px]">
                            <div>امیر مهدی حمیدی</div>
                            <div>تاریخ : 12/12/3</div>
                        </div>
                        <div className="flex justify-between px-5 items-center w-full text-white text-[13px]">
                            <div>لوگو....</div>
                            <div className="flex justify-center gap-2">
                                <span>موجودی : 20,000,000</span>
                                <PriceIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
