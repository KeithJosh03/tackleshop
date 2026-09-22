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

  return (
    <section className={`${montserrat.className} py-12 md:py-16 px-4 md:px-8 lg:px-12 w-full`}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10 md:mb-12">
          <span className="text-ma-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Featured Brands
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ma-primary tracking-tight">
            TRUSTED FISHING BRANDS
          </h2>
          <div className="mt-3 h-[2px] w-12 bg-ma-primary/40 rounded-full" />
        </div>

        {/* Spacious Wide Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 w-full">
          {brandlogos.map((brand, index) => (
            <motion.div
              key={brand.brandId}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="w-full flex"
            >
              <BrandsCard
                brandId={brand.brandId}
                brandName={brand.brandName}
                imageUrl={brand.imageUrl}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}