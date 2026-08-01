"use client";

const LogoIcon = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
        >
            <path
                d="M7.5 7.3C6.3 7.3 5.2 7.75 4.35 8.6L2.95 10C1.2 11.75 1.2 14.65 2.95 16.4C4.7 18.15 7.6 18.15 9.35 16.4L10.1 15.65"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.5 16.7C17.7 16.7 18.8 16.25 19.65 15.4L21.05 14C22.8 12.25 22.8 9.35 21.05 7.6C19.3 5.85 16.4 5.85 14.65 7.6L13.9 8.35"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.4 14.6L14.6 9.4"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default LogoIcon;
