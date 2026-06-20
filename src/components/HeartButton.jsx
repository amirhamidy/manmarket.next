"use client";

export default function HeartButton({
    liked = false,
    loading = false,
    size = 24,
}) {
    if (loading) {
        return (
            <div
                style={{ width: size, height: size }}
                className="
                    rounded-full
                    border-2
                    border-gray-300
                    border-t-[#ef5350]
                    animate-spin
                "
            />
        );
    }

    if (liked) {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M16.609,4.444a4.745,4.745,0,0,0-6.582-.157
                    A4.773,4.773,0,0,0,3.444,11.2
                    l6.583,6.583
                    L16.611,11.2
                    A4.729,4.729,0,0,0,16.609,4.444Z"
                    fill="#ef5350"
                />
            </svg>
        );
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M16.609,4.444a4.745,4.745,0,0,0-6.582-.157
                A4.773,4.773,0,0,0,3.444,11.2
                l6.583,6.583
                L16.611,11.2
                A4.729,4.729,0,0,0,16.609,4.444Z"
                fill="#757575"
            />
        </svg>
    );
}