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
      className={`mx-auto flex w-full flex-col items-center gap-y-6 px-1 py-5 sm:px-2
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
    >
      {/* ── Decorative divider ── */}
      <div className="mx-auto mb-4 flex w-full max-w-4xl items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="h-1 w-1 rotate-45 rounded-[1px] bg-ma-primary/50" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      {/* Section title */}
      <div className="flex flex-col items-center gap-y-2 text-center">
        <h2
          className={`${montserrat.className} text-3xl font-extrabold tracking-widest uppercase text-ma-primary sm:text-4xl`}
        >
          {categoryName} Collection
        </h2>
      </div>

      {/* ── MOBILE: horizontal snap-scroll strip ── */}
      <div className="w-full sm:hidden">
        <div className="flex gap-x-4 overflow-x-auto snap-x snap-mandatory pb-4
          scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          px-4">
          {products.map((product, index) => (
            <div
              key={product.productId}
              className="snap-center shrink-0 w-[78vw] min-h-[300px] flex flex-col"
            >
              <CollectionCard product={product} index={index} />
            </div>
          ))}
          {/* Peek spacer so user knows there's more */}
          <div className="shrink-0 w-4" aria-hidden="true" />
        </div>
      </div>

      {/* ── DESKTOP: grid ── */}
      <div className="hidden w-full gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product, index) => (
          <div key={product.productId} className="h-full">
            <CollectionCard product={product} index={index} />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Link href={`/category/${slugify(categoryName).toLowerCase()}`}
        className="group mt-1 flex items-center gap-x-2 rounded-full border border-white/15 bg-transparent px-6 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-white/5"
      >
        View All {categoryName}
        <svg className="w-4 h-4 text-white/85 transition-transform duration-300 group-hover:translate-x-1"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
