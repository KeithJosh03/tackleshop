import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 w-full max-w-7xl mx-auto p-4 animate-pulse">

      {/* ─── LEFT COLUMN: Image Gallery Skeleton ─── */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        {/* Main Image Skeleton */}
        <div className="w-full aspect-[4/5] bg-[#1a1f1f] rounded-2xl border border-white/5"></div>

        {/* Thumbnails Skeleton */}
        <div className="flex gap-4 overflow-hidden py-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-28 h-28 shrink-0 bg-[#1a1f1f] rounded-xl border border-white/5"></div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Product Info Skeleton ─── */}
      <div className="w-full lg:w-1/2 flex flex-col gap-10 mt-4 lg:mt-0">

        {/* Header Section Skeleton */}
        <div className="flex flex-col gap-6">
          {/* Breadcrumbs */}
          <div className="flex gap-3 items-center">
            <div className="h-6 w-20 bg-[#1a1f1f] rounded-md"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
            <div className="h-4 w-32 bg-[#1a1f1f] rounded-md"></div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <div className="h-12 w-full bg-[#1a1f1f] rounded-lg"></div>
            <div className="h-12 w-3/4 bg-[#1a1f1f] rounded-lg"></div>
          </div>

          {/* Price & Stock */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="h-10 w-48 bg-[#1a1f1f] rounded-lg"></div>
            <div className="h-4 w-24 bg-[#1a1f1f] rounded-md"></div>
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Variant Selectors Skeleton */}
        <div className="flex flex-col gap-8">
          {[...Array(1)].map((_, vi) => (
            <div key={vi} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-[#1a1f1f] rounded-md"></div>
                <div className="h-4 w-24 bg-[#1a1f1f] rounded-md"></div>
              </div>
              <div className="flex flex-wrap gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 w-36 bg-[#1a1f1f] rounded-lg"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr className="border-white/5" />

        {/* Accordions Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-16 w-full bg-[#1a1f1f] rounded-xl"></div>
          <div className="h-16 w-full bg-[#1a1f1f] rounded-xl"></div>
          <div className="h-16 w-full bg-[#1a1f1f] rounded-xl"></div>
        </div>

      </div>
    </div>
  );
}
