const WalletIcon = ({ className = "" }) => {
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
            <rect x="4.5" y="6.5" width="15" height="11" rx="2" />
            <line x1="4.5" y1="10" x2="19.5" y2="10" />
            <line x1="7.5" y1="14" x2="12.5" y2="14" />
        </svg>
    )
}

export default WalletIcon
