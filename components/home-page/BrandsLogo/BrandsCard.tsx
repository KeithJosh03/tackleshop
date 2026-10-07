'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import slugify from 'slugify';
import { BrandProps } from '@/types/brandType';
import { montserrat } from '@/types/fonts';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function BrandsCard({ brandId, brandName, imageUrl }: BrandProps) {
  const resolvedImageUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    : null;

  const brandSlug = `/brand/${slugify(brandName.toLowerCase())}`;

  return (
    <Link
      href={brandSlug}
      className="group/card relative flex h-28 sm:h-32 md:h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-ma-primary/60 hover:bg-black/80 hover:shadow-[0_0_25px_-5px_rgba(232,147,71,0.3)]"
      aria-label={`View products for ${brandName}`}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ma-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

      <div className="relative flex h-full w-full items-center justify-center">
        {resolvedImageUrl ? (
          <>
            {/* Logo dims or slides up slightly on hover */}
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover/card:-translate-y-3 group-hover/card:opacity-40">
              <Image
                src={resolvedImageUrl}
                alt={`${brandName} logo`}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-contain p-2 brightness-0 invert"
              />
            </div>

            {/* Brand Name reveals cleanly underneath on hover */}
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-center opacity-0 translate-y-3 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-y-0">
              <span className={`${montserrat.className} text-xs sm:text-sm font-bold text-ma-primary uppercase tracking-wider text-center bg-black/60 px-2.5 py-1 rounded-full border border-ma-primary/30`}>
                {brandName}
              </span>
            </div>
          </>
        ) : (
          <span className={`${montserrat.className} text-sm sm:text-base font-bold text-white/90 uppercase tracking-widest text-center group-hover/card:text-ma-primary transition-colors`}>
            {brandName}
          </span>
        )}
      </div>
    </Link>
  );
}