export default function SkeletonBrandCategoryCardRoutesSkeletonCard() {
    return (
        <div className="rounded-md border border-[#323537] bg-[#1d2022] overflow-hidden animate-pulse min-h-[360px] flex flex-col">
            <div className="w-full flex-1 bg-[#0b0f10]" style={{ minHeight: '240px' }} />
            <div className="px-5 py-4 flex flex-col gap-2 flex-1 justify-end">
                <div className="h-2 w-1/3 rounded bg-[#323537]" />
                <div className="h-3 w-3/4 rounded bg-[#363a3b]" />
                <div className="h-4 w-1/2 rounded bg-[#363a3b] mt-1" />
            </div>
        </div>
    );
}


