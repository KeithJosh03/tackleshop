"use client";

import { BrandLogosProps } from "@/lib/api/brandService";
import { montserrat } from "@/types/fonts";
import Link from "next/link";
import slugify from "slugify";
import Image from "next/image";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function BrandCard({ brandId, brandName, imageUrl }: BrandLogosProps) {
  return (
    <Link
      href={`/brand/${slugify(brandName.toLowerCase())}`}
      key={brandId}
      className="group relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-ma-surface-container transition-all duration-500 hover:border-ma-primary/40 hover:shadow-[0_0_20px_-6px_rgba(232,147,71,0.12)]"
      aria-label={brandName}
    >
      {/* Subtle gradient shine on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-ma-primary/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Brand logo image */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4 sm:p-5">
        <Image
          src={`${baseURL}${imageUrl}`}
          alt={brandName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 sm:p-4"
        />
      </div>

      {/* Hover overlay — brand name reveal */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center overflow-hidden rounded-xl">
        <div
          className={`${montserrat.className} flex w-full translate-y-full items-center justify-center bg-gradient-to-t from-black/90 via-black/70 to-transparent px-3 pb-3 pt-8 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ma-on-surface opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:text-[0.7rem]`}
        >
          <span className="rounded-full border border-ma-primary/30 bg-ma-primary/15 px-3 py-1 backdrop-blur-sm">
            {brandName}
          </span>
        </div>
      </div>
    </Link>
  );
}