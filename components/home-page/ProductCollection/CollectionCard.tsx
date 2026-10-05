"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { slugify } from "@/utils/slugify";
import { numericConverter } from "@/utils/priceUtils";
import { ProductCollections } from "@/types/categoryType";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/";

interface CollectionCardProps {
  product: ProductCollections & {
    discountedMinPrice?: number;
    hasDiscount?: boolean;
    discountLabel?: string;
  };
  index?: number;
}

export default function CollectionCard({ product, index = 0 }: CollectionCardProps) {
  const {
    productId,
    basePrice,
    minPrice,
    discountedMinPrice,
    hasDiscount,
    discountLabel,
    productTitle,
    productThumbNail,
    subCategoryName,
  } = product;

  const currentMinPrice = minPrice ?? basePrice ?? 0;
  const finalPrice = hasDiscount && discountedMinPrice !== undefined ? discountedMinPrice : currentMinPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/product-details/${productId}/${slugify(productTitle || "").toLowerCase()}`}
        className="group relative flex flex-col overflow-hidden rounded-md border border-[#323537]
          bg-[#1d2022] cursor-pointer transition-all duration-300 hover:border-[#ffc49a] min-h-[360px] h-full block"
      >
        {/* Image area */}
        <div className="relative w-full flex-1 overflow-hidden bg-[#0b0f10]" style={{ minHeight: "240px" }}>
          <Image
            src={
              productThumbNail
                ? `${baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL}${productThumbNail.startsWith("/") ? "" : "/"
                }${productThumbNail}`
                : "/logo.png"
            }
            alt={productTitle || "Product Image"}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/* Promotion Discount Badge */}
          {hasDiscount && discountLabel ? (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-[0.65rem] font-black px-2.5 py-1 rounded-sm uppercase tracking-wider z-10 shadow-md">
              {discountLabel} SALE
            </div>
          ) : (
            index < 2 && (
              <div className="absolute top-4 left-4 bg-[#ffc49a] text-[#4f2500] text-[0.65rem] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider z-10">
                NEW
              </div>
            )
          )}
        </div>

        {/* Content area */}
        <div className="px-5 py-4 flex flex-col gap-1 flex-1 justify-end">
          <span className="text-[#ffc49a] text-[0.65rem] font-bold uppercase tracking-[0.1em]">
            {subCategoryName}
          </span>
          <h3 className="text-[#e0e3e5] font-bold text-sm leading-snug line-clamp-2 uppercase">
            {productTitle}
          </h3>

          {/* Price Section */}
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[#ffc49a] font-extrabold text-xl tracking-tight">
              {numericConverter(String(finalPrice))}
            </span>

            {hasDiscount && (
              <span className="text-[#8c9196] line-through text-xs font-semibold">
                {numericConverter(String(currentMinPrice))}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}