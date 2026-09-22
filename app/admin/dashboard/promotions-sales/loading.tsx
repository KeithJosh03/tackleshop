export default function PromotionsSalesLoading() {
    return (
        <div className="flex flex-col gap-y-6 text-[#d9e3f4] pb-12 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-7 w-56 bg-greyColor/20 rounded-md" />
                    <div className="h-3.5 w-80 bg-greyColor/10 rounded-md" />
                </div>
                <div className="h-10 w-40 bg-greyColor/20 rounded-lg self-start sm:self-auto" />
            </div>

            {/* Filter and Search Bar Skeleton */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-ma-surface-container/50 p-4 rounded-xl border border-greyColor/20">
                <div className="flex items-center gap-x-2 w-full md:w-auto">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-20 bg-greyColor/20 rounded-lg" />
                    ))}
                </div>
                <div className="h-9 w-full md:w-72 bg-greyColor/20 rounded-lg" />
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="bg-ma-surface-container/50 border border-greyColor/20 rounded-xl p-5 flex flex-col justify-between h-[210px]"
                    >
                        <div>
                            {/* Status Badge & Actions */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-5 w-20 bg-greyColor/20 rounded-md" />
                                <div className="flex gap-x-2">
                                    <div className="h-5 w-5 bg-greyColor/15 rounded" />
                                    <div className="h-5 w-5 bg-greyColor/15 rounded" />
                                </div>
                            </div>

                            {/* Title Skeleton */}
                            <div className="h-5 w-3/4 bg-greyColor/20 rounded-md mb-4" />

                            {/* Value Skeleton */}
                            <div className="h-8 w-24 bg-greyColor/30 rounded-md" />
                        </div>

                        {/* Footer Skeleton */}
                        <div className="space-y-2 border-t border-greyColor/20 pt-4">
                            <div className="h-3.5 w-1/2 bg-greyColor/10 rounded" />
                            <div className="h-3.5 w-2/3 bg-greyColor/10 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}