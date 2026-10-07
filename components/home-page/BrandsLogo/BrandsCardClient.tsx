'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrandProps } from '@/types/brandType';
import { montserrat } from '@/types/fonts';
import BrandsCard from './BrandsCard';

type Props = {
  brandlogos: BrandProps[];
};

export default function BrandsCardClient({ brandlogos = [] }: Props) {
  if (!brandlogos || brandlogos.length === 0) {
    return null;
  }

  // Duplicate items to create a seamless infinite loop track
  const duplicatedBrands = [...brandlogos, ...brandlogos, ...brandlogos];

  return (
    <section className={`${montserrat.className} py-12 md:py-16 w-full overflow-hidden`}>
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 mb-8 md:mb-10">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-ma-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Featured Brands
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ma-primary tracking-tight">
            TRUSTED FISHING BRANDS
          </h2>
          <div className="mt-3 h-[2px] w-12 bg-ma-primary/40 rounded-full" />
        </div>
      </div>

      {/* Infinite Marquee Track Container */}
      <div className="relative w-full overflow-hidden flex items-center py-2">
        {/* Left/Right Fade Edges for cinematic look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4 md:gap-6 shrink-0 w-max items-center"
          animate={{
            x: ['0%', '-33.333%'],
          }}
          transition={{
            duration: 35, // Adjust speed: higher number = slower glide, lower number = faster
            ease: 'linear',
            repeat: Infinity,
          }}
          whileHover={{
            // Pause animation smoothly on hover so user can easily click a brand
            animationPlayState: 'paused',
          }}
        >
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.brandId}-${index}`}
              className="w-48 sm:w-56 md:w-64 shrink-0 flex"
            >
              <BrandsCard
                brandId={brand.brandId}
                brandName={brand.brandName}
                imageUrl={brand.imageUrl}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}