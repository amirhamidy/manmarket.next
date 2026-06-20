"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AllElStep from "@/components/AllElEstep/AllElStep";

export default function Welcome() {
    const router = useRouter();

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisitedWelcome");
        if (hasVisited) {
            router.replace("/");
        }
    }, [router]);

    const handleEnterSite = () => {
        localStorage.setItem("hasVisitedWelcome", "true");
        router.replace("/");
    };

    return (
        <div className="flex justify-center items-start w-full min-h-screen bg-white">
            <div className="w-full max-w-[556px]">
                <AllElStep onFinish={handleEnterSite} />
            </div>
        </div>
    );
}
