const OrderIcon = ({ className = "" }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-6 h-6 text-[#757575] ${className}`}
            aria-hidden="true"
        >
            <rect x="5.5" y="4.5" width="13" height="15" rx="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="15" x2="12.5" y2="15" />
        </svg>
    )
}

export default OrderIcon
