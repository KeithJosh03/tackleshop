"use client";

import Link from "next/link";
import slugify from "slugify";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import CollectionCard from "./CollectionCard";
import { ProductCollections } from "@/lib/api/categoryService";
import { montserrat } from "@/types/fonts";

export default function CollectionComponentLayout({
  categoryName,
  products,
}: {
  products: ProductCollections[];
  categoryName: string;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`mx-auto flex w-full flex-col items-center gap-y-6 sm:gap-y-8 px-2 sm:px-4 py-6 sm:py-8
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
    >
      {/* ── Decorative Section Divider ── */}
      <div className="mx-auto flex w-full max-w-4xl items-center gap-4 opacity-80">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ma-primary/20 to-transparent" />
        <div className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-ma-primary/60 shadow-[0_0_8px_rgba(232,147,71,0.5)]" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ma-primary/20 to-transparent" />
      </div>

      {/* Section title */}
      <div className="flex flex-col items-center gap-y-2 text-center">
        <h2
          className={`${montserrat.className} text-xl sm:text-2xl md:text-3xl font-extrabold tracking-[0.15em] uppercase text-ma-primary sm:text-4xl`}
        >
          {categoryName} Collection
        </h2>
        <div className="h-[2px] w-10 bg-ma-primary/40 rounded-full mt-1" />
      </div>

      {/* ── MOBILE & TABLET & DESKTOP: Responsive Grid (2 cols on mobile, 4 cols on desktop) ── */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {products.slice(0, 4).map((product, index) => (
          <div key={product.productId} className="h-full">
            <CollectionCard product={product} index={index} />
          </div>
        ))}
      </div>

      {/* Refined CTA Button */}
      <Link
        href={`/category/${slugify(categoryName).toLowerCase()}`}
        className="group mt-2 inline-flex items-center gap-x-2.5 rounded-full border border-ma-primary/30 bg-black/40 px-6 sm:px-7 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-ma-primary backdrop-blur-sm transition-all duration-300 hover:border-ma-primary hover:bg-ma-primary hover:text-black hover:shadow-[0_0_20px_-4px_rgba(232,147,71,0.4)]"
      >
        <span>View All {categoryName}</span>
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}