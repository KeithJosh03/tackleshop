import { inter } from "@/types/fonts";

export interface Review {
    review_id: string;
    reviewer_name: string;
    rating: number;
    review_date: string;
    comment: string;
}

export function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? "text-[#E89347]" : "text-gray-600"
                        }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function getInitials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function ReviewCard({ review, index }: { review: Review; index: number }) {
    return (
        <div
            className="flex-shrink-0 w-[300px] sm:w-[320px] rounded-2xl p-5 flex flex-col gap-y-3 border border-white/10 backdrop-blur-sm"
            style={{
                background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(232,147,71,0.04) 100%)",
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
            }}
        >
            {/* Top row: avatar + name + Facebook icon */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                    {/* Avatar */}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{
                            background:
                                "linear-gradient(135deg, #E89347 0%, #835d32 100%)",
                        }}
                    >
                        {getInitials(review.reviewer_name)}
                    </div>
                    <div className="flex flex-col">
                        <span
                            className={`${inter.className} text-sm font-semibold text-white leading-tight`}
                        >
                            {review.reviewer_name}
                        </span>
                        <span
                            className={`${inter.className} text-xs text-tertiaryColor/50`}
                        >
                            {formatDate(review.review_date)}
                        </span>
                    </div>
                </div>

                {/* Facebook logo badge */}
                <div
                    onClick={() => { window.open('https://www.facebook.com/WankOfficial', '_blank') }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/30 cursor-pointer"
                >
                    <svg
                        className="w-4 h-4 text-[#1877F2]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 6.027 4.388 11.025 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.793-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.098 24 18.1 24 12.073z" />
                    </svg>
                </div>
            </div>

            {/* Stars */}
            <StarRating rating={review.rating} />

            {/* Comment */}
            <p
                className={`${inter.className} text-sm text-tertiaryColor/75 leading-relaxed line-clamp-4`}
            >
                &ldquo;{review.comment}&rdquo;
            </p>

            {/* Recommended badge */}
            <div className="flex items-center gap-x-1.5 mt-auto pt-1">
                <svg
                    className="w-3.5 h-3.5 text-[#E89347]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className={`${inter.className} text-xs text-[#E89347]/80`}>
                    Recommends Smooth Casting
                </span>
            </div>
        </div>
    );
}
