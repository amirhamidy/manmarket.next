const PassIcon = ({ className = "" }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`w-6 h-6 text-[#757575] ${className}`}
            aria-hidden="true"
        >
            <path
                d="M7.8 11.2h8.4a1.4 1.4 0 0 1 1.4 1.4v4.8a1.4 1.4 0 0 1-1.4 1.4H7.8a1.4 1.4 0 0 1-1.4-1.4v-4.8a1.4 1.4 0 0 1 1.4-1.4z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M9.2 11.2V8.8a2.8 2.8 0 0 1 5.6 0v2.4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    )
}

export default PassIcon
