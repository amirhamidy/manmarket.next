
export function LicenseDraft({ className = "" }) {
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
            <rect x="5" y="4" width="14" height="16" rx="2" />

            <line x1="8" y1="8" x2="16" y2="8" />

            <line x1="8" y1="11.5" x2="14" y2="11.5" />

            <circle cx="15.5" cy="15.5" r="2.5" />
            <path d="M14.6 15.5l.7.7 1.6-1.6" />
        </svg>
    )
}
