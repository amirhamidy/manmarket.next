"use client";

export default function FavoritesEmptyState({ onStartproductping }) {
    return (
        <div className="flex flex-col items-center justify-center text-center px-6 py-24">
            <svg
                width="70"
                height="60"
                viewBox="0 0 68 62"
                fill="none"
                className="mb-6"
            >
                <path
                    d="M60.355 8.665C52.63 0.94 40.56 1.17 34.028 8.036C27.49 1.17 15.42 0.94 7.694 8.678C-0.03 16.4 -0.03 28.948 7.694 36.67L34.028 62L60.362 36.67C68.08 28.948 68.08 16.4 60.355 8.665Z"
                    fill="#ff7643"
                />
            </svg>

            <h2 className="text-[18px] font-bold text-[#757575] mb-3">
                فعلا چیزی توی علاقه مندی ها وجود نداره 
            </h2>

            <p className="text-[13px] text-[#757575] leading-6 mb-10">
                تو سایت یه چرخی بزن و ببین چیزی پیدا نمیشه بهش علاقه مند باشی
            </p>

            <button
                onClick={onStartproductping}
                className="bg-[#ff7643] hover:bg-[#ff5e2b] transition text-white px-10 py-3 rounded-full text-[13px]"
            >
                دیدن از سایت
            </button>
        </div>
    );
}
