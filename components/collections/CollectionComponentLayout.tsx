"use client";

import { worksans } from "@/types/fonts";
import Link from "next/link";
import slugify from "slugify";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CollectionComponentLayout({
  categoryName,
  children,
}: {
  children: React.ReactNode;
  categoryName: string;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={ref}
      className={`${worksans.className} w-full flex flex-col items-center justify-center 
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}
      `}
    >
      {/* Title */}
      <h1 className="text-primaryColor font-extrabold text-2xl md:text-4xl mb-6">
        {`${categoryName} Collection`}
      </h1>

      {/* --- Responsive Grid / Carousel --- */}
      <div className="relative w-full">
        {/* Buttons (visible only on mobile/tablet) */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-primaryColor text-white p-2 rounded-full shadow-lg md:hidden"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-primaryColor text-white p-2 rounded-full shadow-lg md:hidden"
        >
          <ChevronRight size={20} />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="
            flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth 
            sm:px-6 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4
            md:overflow-visible md:gap-4
          "
        >
          {children}
        </div>
      </div>

      {/* View All Button */}
      <Link href={`/category/${slugify(categoryName).toLowerCase()}`}>
        <button className="button-view text-md font-extrabold mt-8">
          View All
        </button>
      </Link>
    </div>
  );
}
