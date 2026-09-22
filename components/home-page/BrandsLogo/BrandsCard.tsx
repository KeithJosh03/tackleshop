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
      key={brandId}
      className="group relative flex h-28 sm:h-32 md:h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-ma-primary/60 hover:bg-black/60 hover:shadow-[0_0_20px_-5px_rgba(232,147,71,0.2)]"
      aria-label={`View products for ${brandName}`}
    >
      {/* Subtle ambient hover glow matching hero theme */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ma-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full w-full items-center justify-center">
        {resolvedImageUrl ? (
          <Image
            src={resolvedImageUrl}
            alt={`${brandName} logo`}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            // brightness-0 invert converts dark PNG logos to crisp white matching hero typography
            className="object-contain p-2 brightness-0 invert opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
          />
        ) : (
          <span className={`${montserrat.className} text-sm sm:text-base font-bold text-white/90 uppercase tracking-widest text-center group-hover:text-ma-primary transition-colors`}>
            {brandName}
          </span>
        )}
      </div>
    </Link>
  );
}