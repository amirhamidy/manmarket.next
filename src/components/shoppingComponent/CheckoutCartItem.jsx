export default function CheckoutCartItem({
    title,
    price,
    size,
    color,
    qty,
    onIncrease,
    onDecrease,
}) {
    return (
        <article
            className="
        max-w-[556px]  w-full
        rounded-[24px] bg-white
        shadow-[0_8px_16px_rgba(0,11,36,0.04)]
        flex items-center p-2 gap-4
        transition-all duration-200 ease-out
        hover:shadow-[0_12px_24px_rgba(0,11,36,0.08)]
        focus-within:ring-2 focus-within:ring-[#ff7643]/20
      "
        >
            <figure className="w-[80px] h-[80px] rounded-[24px] bg-gray-200 flex-shrink-0" />

            <section className="flex-1 flex flex-col justify-between">
                <h6 className="text-[#ff7643] text-[14px] ">
                    {title}
                </h6>

                <div className="flex gap-6 text-[13px]">
                    <div className="flex gap-1 my-1">
                        <span className="text-[#c7c7c7]">Size:</span>
                        <span className="text-[#ff7643]">{size}</span>
                    </div>
                    <div className="flex gap-1 my-1">
                        <span className="text-[#c7c7c7]">Color:</span>
                        <span className="text-[#ff7643]">{color}</span>
                    </div>
                </div>

                <span className="text-[#ff7643] text-[14px]">
                    ${price}
                </span>
            </section>

            <aside className="flex flex-col items-center justify-center gap-1">
                <button
                    onClick={onIncrease}
                    className="
            w-7 h-7 rounded-full
            text-[#757575]
            transition
            hover:bg-[#ff7643]/10
            focus-visible:ring-2 focus-visible:ring-[#ff7643]/30
            active:scale-95
          "
                >
                    +
                </button>

                <span className="text-[#ff7643] text-[14px]">{qty}</span>

                <button
                    onClick={onDecrease}
                    className="
            w-7 h-7 rounded-full
            text-[#757575]
            transition
            hover:bg-[#ff7643]/10
            focus-visible:ring-2 focus-visible:ring-[#ff7643]/30
            active:scale-95
          "
                >
                    −
                </button>
            </aside>
        </article>
    );
}
