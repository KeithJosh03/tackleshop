import React from "react";

interface PaginationBtnProps {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
}

function PaginationBtn({ onClick, disabled, children }: PaginationBtnProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 border
        ${disabled
                    ? 'border-[#323537] text-[#544338] cursor-not-allowed opacity-50'
                    : 'border-[#a28d7e] text-[#e0e3e5] hover:border-[#ffc49a] hover:text-[#ffc49a]'
                }
      `}
        >
            {children}
        </button>
    );
}

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    hasMore: boolean;
    loading: boolean;
    onPageChange: (page: number) => void;
}

export default function BrandCategoryPaginationButton({
    currentPage,
    lastPage,
    hasMore,
    loading,
    onPageChange,
}: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-4 mt-4">
            <PaginationBtn
                disabled={currentPage === 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Prev
            </PaginationBtn>

            <div className="flex items-center gap-2">
                {Array.from({ length: lastPage }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i + 1)}
                        disabled={loading}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all duration-200 border
              ${currentPage === i + 1
                                ? 'bg-[#ffc49a] text-[#4f2500] border-[#ffc49a]'
                                : 'border-[#323537] text-[#a28d7e] hover:border-[#a28d7e]'
                            }
            `}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <PaginationBtn
                disabled={!hasMore || loading}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </PaginationBtn>
        </div>
    );
}