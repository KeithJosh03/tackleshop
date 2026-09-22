"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { slugify } from "@/utils/slugify";
import { numericConverter } from "@/utils/priceUtils";
import { CategorizeProduct } from "@/types/dataprops";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

interface CategoryCardsProps {
  product: CategorizeProduct;
  index?: number;
}

export default function CategoryCards({ product, index = 0 }: CategoryCardsProps) {
  const {
    productId,
    basePrice,
    minPrice,
    maxPrice,
    formattedPrice,
    productTitle,
    productThumbNail,
    subCategoryName,
  } = product;

  // 1. Resolve Price Rendering Logic
  const renderPrice = () => {
    if (formattedPrice) return formattedPrice;

    if (minPrice !== undefined && minPrice !== null) {
      if (minPrice === maxPrice) {
        return numericConverter(String(minPrice));
      }
      return `${numericConverter(String(minPrice))} - ${numericConverter(String(maxPrice))}`;
    }

    return numericConverter(String(basePrice));
  };

  // 2. Resolve Image URL with Fallback
  const getImageUrl = () => {
    if (!productThumbNail) return '/logo.png';
    const cleanBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    const cleanPath = productThumbNail.startsWith('/') ? productThumbNail : `/${productThumbNail}`;
    return `${cleanBase}${cleanPath}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/product-details/${productId}/${slugify(productTitle || '').toLowerCase()}`}
        className="group relative flex flex-col overflow-hidden rounded-md border border-[#323537]
          bg-[#1d2022] cursor-pointer transition-all duration-300 hover:border-[#ffc49a] min-h-[360px] h-full block"
      >
        {/* Image Area */}
        <div className="relative w-full flex-1 overflow-hidden bg-[#0b0f10]" style={{ minHeight: '240px' }}>
          <Image
            src={getImageUrl()}
            alt={productTitle || 'Product Image'}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/* Badge */}
          {index < 2 && (
            <div className="absolute top-4 left-4 bg-[#ffc49a] text-[#4f2500] text-[0.65rem] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider z-10">
              NEW
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="px-5 py-4 flex flex-col gap-1 flex-1 justify-end">
          {subCategoryName && (
            <span className="text-[#ffc49a] text-[0.65rem] font-bold uppercase tracking-[0.1em]">
              {subCategoryName}
            </span>
          )}
          <h3 className="text-[#e0e3e5] font-bold text-sm leading-snug line-clamp-2 uppercase">
            {productTitle}
          </h3>
          <div className="mt-1 text-[#ffc49a] font-extrabold text-xl tracking-tight">
            {renderPrice()}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}