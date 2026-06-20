"use client";

export default function ProductDescription({ description, specifications }) {
    const isLoading =
        !description ||
        description.length === 0 ||
        !specifications;

    if (isLoading) {
        return (
            <div className="mb-12 space-y-4">
                <div className="h-4 w-full rounded animate-pulse bg-[#ededed]" />
                <div className="h-4 w-[95%] rounded animate-pulse bg-[#ededed]" />
                <div className="h-4 w-[90%] rounded animate-pulse bg-[#ededed]" />

                <div className="mt-8 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex justify-between gap-4"
                        >
                            <div className="h-4 w-1/3 rounded animate-pulse bg-[#ededed]" />
                            <div className="h-4 w-1/3 rounded animate-pulse bg-[#ededed]" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-12 !important">
            <div
                className="text-[13px] font-medium text-[#757575] leading-[18px] mb-8 !important"
                dangerouslySetInnerHTML={{ __html: description || "" }}
            />

            {specifications && specifications.length > 0 && (
                <dl className="grid grid-cols-2 gap-2 text-[13px] font-medium text-[#757575] !important">
                    {specifications
                        .filter((s) => s.status)
                        .map((spec, i) => (
                            <div
                                key={i}
                                className="col-span-2 flex justify-between py-1 border-b border-[#f0f0f0] !important"
                            >
                                <dt className="font-medium !important">
                                    {spec.name}:
                                </dt>
                                <dd className="text-left !important">
                                    {spec.value}
                                </dd>
                            </div>
                        ))}
                </dl>
            )}
        </div>
    );
}
