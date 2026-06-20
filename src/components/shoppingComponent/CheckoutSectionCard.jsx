"use client";

export default function CheckoutSectionCard({
    title,
    actionLabel,
    onAction,
    onMore,
}) {
    return (
        <article
            className="
        max-w-[556px] w-full
        rounded-[24px] bg-white
        shadow-[0_8px_16px_rgba(0,11,36,0.04)]
        px-5 py-4 flex flex-col justify-between
        transition-all duration-200 ease-out
        hover:shadow-[0_12px_24px_rgba(0,11,36,0.08)]
        focus-within:ring-2 focus-within:ring-[#ff7643]/20
      "
        >
            <header className="flex items-center justify-between">
                <h2 className="text-[#757575] text-[14px]">{title}</h2>

                <button
                    onClick={onMore}
                    className="
            text-[#757575] my-2
            transition
            hover:bg-gray-100 rounded-md
            focus-visible:ring-2 focus-visible:ring-[#ff7643]/30
          "
                >
                    ⋮
                </button>
            </header>

            <button
                onClick={onAction}
                className="
          px-3 py-2 w-fit
          rounded-[16px]
          border border-dashed border-[#ededed]
          flex items-center gap-2 px-4
          text-[#ff7643] text-[14px]
          transition-all duration-200
          hover:border-[#ff7643]
          hover:bg-[#ff7643]/5
          focus-visible:ring-2 focus-visible:ring-[#ff7643]/30
          active:scale-[0.98]
        "
            >
                {actionLabel}
            </button>
        </article>
    );
}