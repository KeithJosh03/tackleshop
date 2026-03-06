"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { slugify } from "@/utils/slugify";
import { numericConverter } from "@/utils/priceUtils";
import { CategorizeProduct } from "@/types/dataprops";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function CategoryCards({ product, index }: { product: CategorizeProduct; index: number }) {
  const { basePrice, brandName, productThumbNail, productId, productTitle, subCategoryName } = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link
        href={`/product/${productId}/${slugify(productTitle).toLowerCase()}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-greyColor
          bg-blackgroundColor/70 backdrop-blur-sm cursor-pointer
          transition-all duration-300 hover:border-primaryColor min-h-[340px] block"
        style={{ boxShadow: 'none' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 24px 4px rgba(232,147,71,0.22)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        {/* Image area */}
        <div className="relative w-full flex-1 overflow-hidden bg-mainBackgroundColor" style={{ minHeight: '220px' }}>
          <Image
            src={`${baseURL}${productThumbNail}`}
            alt={productTitle}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/* Price badge */}
          <div className="absolute top-3 left-3 bg-primaryColor text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
            {numericConverter(String(basePrice))}
          </div>

          {/* Sub-category tag */}
          <div className="absolute top-3 right-3 bg-blackgroundColor/80 border border-greyColor text-[0.65rem] font-semibold uppercase tracking-widest text-secondary px-2 py-1 rounded-md z-10">
            {subCategoryName}
          </div>
        </div>

        {/* Hover slide-up overlay */}
        <div className="
          absolute bottom-0 left-0 right-0
          bg-gradient-to-t from-blackgroundColor/98 via-blackgroundColor/85 to-transparent
          px-4 py-4
          translate-y-full group-hover:translate-y-0
          transition-transform duration-300 ease-out
          flex flex-col gap-y-1
        ">
          <span className="text-primaryColor text-[0.68rem] font-bold uppercase tracking-widest">
            {brandName}
          </span>
          <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">
            {productTitle}
          </h3>
          <span className="text-gray-400 text-[0.7rem] uppercase tracking-wide mt-0.5">
            {subCategoryName}
          </span>
        </div>

        {/* Default bottom label (fades out on hover) */}
        <div className="px-4 py-3 flex flex-col gap-0.5 group-hover:opacity-0 transition-opacity duration-200">
          <h3 className="font-bold text-primaryColor leading-snug line-clamp-2 text-sm">
            {productTitle.toUpperCase()}
          </h3>
          <p className="text-gray-500 text-[0.72rem] uppercase tracking-wide">{subCategoryName}</p>
        </div>
      </Link>
    </motion.div>
  );
}
