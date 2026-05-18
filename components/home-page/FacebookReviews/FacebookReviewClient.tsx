"use client";

import { inter } from "@/types/fonts";
import { useEffect, useRef, useState } from "react";
import ReviewCard, { StarRating } from "./ReviewCard";
import { getReviews, type Review } from "@/lib/api/reviewService";

export default function FacebookReviewClient({ reviews }: { reviews: Review[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const positionRef = useRef(0);
    const animFrameRef = useRef<number | null>(null);
    const speed = 0.5; // px per frame
    const [isLoading, setIsLoading] = useState(true);


    // Duplicate reviews for seamless loop
    const loopedReviews = [...reviews, ...reviews];

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const step = () => {
            if (!isPaused) {
                positionRef.current += speed;
                const halfWidth = track.scrollWidth / 2;
                if (positionRef.current >= halfWidth) {
                    positionRef.current = 0;
                }
                track.style.transform = `translateX(-${positionRef.current}px)`;
            }
            animFrameRef.current = requestAnimationFrame(step);
        };

        animFrameRef.current = requestAnimationFrame(step);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isPaused]);

    return (
        <section
            className="w-full flex flex-col items-center justify-center py-14 gap-y-10 overflow-hidden"
            id="facebookreviews"
        >
            {/* ── Header ── */}
            <div className="flex flex-col items-center gap-y-3 px-4 text-center">
                {/* Facebook badge */}
                <div className="flex items-center gap-x-2 px-4 py-1.5 rounded-full border border-[#1877F2]/30 bg-[#1877F2]/10 w-fit">
                    <svg
                        className="w-4 h-4 text-[#1877F2]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M24 12.073C24 5.446 18.627 0 12 0S0 5.446 0 12.073c0 6.027 4.388 11.025 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.793-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.098 24 18.1 24 12.073z" />
                    </svg>
                    <span
                        onClick={() => { window.open('https://www.facebook.com/WankOfficial', '_blank') }}
                        className={`${inter.className} text-xs font-medium text-[#1877F2] cursor-pointer`}
                    >
                        Facebook Reviews
                    </span>
                </div>

                {/* Title */}
                <h2
                    className="text-3xl sm:text-4xl font-extrabold tracking-widest uppercase"
                    style={{
                        background:
                            "linear-gradient(90deg, #E89347 0%, #fafaf9 60%, #835d32 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    What Our Anglers Say
                </h2>

                {/* Divider */}
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primaryColor to-transparent" />

                {/* Subtitle */}
                <p
                    className={`${inter.className} text-sm sm:text-base text-tertiaryColor/70 max-w-md`}
                >
                    Real reviews from our fishing community — see why anglers trust
                    TackleShop.
                </p>

                {/* Overall rating summary */}
                <div className="flex items-center gap-x-3 mt-1">
                    <div className="flex items-center gap-x-1.5">
                        <span
                            className={`${inter.className} text-2xl font-extrabold text-[#E89347]`}
                        >
                            4.8
                        </span>
                        <div className="flex flex-col">
                            <StarRating rating={5} />
                            <span
                                className={`${inter.className} text-xs text-tertiaryColor/50`}
                            >
                                {reviews.length} reviews
                            </span>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex items-center gap-x-1">
                        <svg
                            className="w-4 h-4 text-[#E89347]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span
                            className={`${inter.className} text-xs text-tertiaryColor/70`}
                        >
                            Verified Facebook Page
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Scrolling Review Cards ── */}
            <div
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* Left fade */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-20 z-10"
                    style={{ background: "linear-gradient(to right, var(--background, #0a0a0a), transparent)" }}
                />
                {/* Right fade */}
                <div className="pointer-events-none absolute right-0 top-0 h-full w-20 z-10"
                    style={{ background: "linear-gradient(to left, var(--background, #0a0a0a), transparent)" }}
                />

                <div
                    ref={trackRef}
                    className="flex gap-x-4 w-max will-change-transform py-2 px-4"
                    style={{ transform: "translateX(0px)" }}
                >
                    {loopedReviews.map((review, index) => (
                        <ReviewCard
                            key={`${review.reviewId}-${index}`}
                            review={review}
                            index={index % reviews.length}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
