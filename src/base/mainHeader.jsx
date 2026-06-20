"use client"

import { useTheme } from "@/context/ThemeContext";
import { useHeader } from "@/hook/useHeader"

const MainHeader = () => {
    const { title, onBack } = useHeader()
    const { theme } = useTheme();

    return (
        <div dir="ltr" className="flex justify-start gap-3 items-center px-3 py-5 sticky top-0">
            <button
                onClick={onBack}
                className="rounded-[4px] flex items-center justify-center"
            >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#757575">
                    <path d="M18.586 10.121H5.912l4.6-4.6-1.229-1.229-6.7 6.7 6.7 6.7 1.229-1.229-4.6-4.6h12.674z" />
                </svg>
            </button>

            <h1 className="text-[17px] font-bold text-[#757575]">
                {title}
            </h1>
        </div>
    )
}

export default MainHeader
