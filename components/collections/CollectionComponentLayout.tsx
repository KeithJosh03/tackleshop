"use client";

import Link from "next/link";
import slugify from "slugify";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import CollectionCard from "./CollectionCard";
import { ProductCollections } from "@/lib/api/categoryService";

export default function CollectionComponentLayout({
  categoryName,
  products,
}: {
  products: ProductCollections[];
  categoryName: string;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>();

  const [featured, ...rest] = products;

  return (
    <div
      ref={ref}
      className={`w-full mx-auto flex flex-col items-center gap-y-6
        transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
    >
      {/* Section title */}
      <div className="flex flex-col items-center gap-y-2 text-center">
        <h2
          className="text-3xl sm:text-4xl font-extrabold tracking-widest uppercase"
          style={{
            background: 'linear-gradient(90deg, #E89347 0%, #fafaf9 55%, #835d32 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {categoryName} Collection
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-primaryColor to-transparent" />
      </div>

      {/* ── MOBILE: horizontal snap-scroll strip ── */}
      <div className="w-full sm:hidden">
        <div className="flex gap-x-4 overflow-x-auto snap-x snap-mandatory pb-4
          scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          px-4">
          {products.map((product) => (
            <div
              key={product.productId}
              className="snap-center shrink-0 w-[78vw] min-h-[300px] flex flex-col"
            >
              <CollectionCard product={product} />
            </div>
          ))}
          {/* Peek spacer so user knows there's more */}
          <div className="shrink-0 w-4" aria-hidden="true" />
        </div>
      </div>

      {/* ── DESKTOP: grid ── */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {products.slice(0, 4).map((product) => (
          <div key={product.productId} className="h-full">
            <CollectionCard product={product} />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Link href={`/category/${slugify(categoryName).toLowerCase()}`}
        className="group flex items-center gap-x-2 bg-transparent border border-primaryColor text-primaryColor
          hover:bg-primaryColor hover:text-white
          font-bold text-sm tracking-wider uppercase
          px-8 py-3 rounded-full
          transition-all duration-300 mt-2"
      >
        View All {categoryName}
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
