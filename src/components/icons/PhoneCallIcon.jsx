
export function PhoneCallLight({ className = "" }) {
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
            <path d="M6 12a6 6 0 0 1 12 0" />

            <rect x="5" y="11" width="3" height="5" rx="1" />

            <rect x="16" y="11" width="3" height="5" rx="1" />

            <path d="M15 16c0 1.5-1.5 2.5-3 2.5" />
        </svg>
    )
}
