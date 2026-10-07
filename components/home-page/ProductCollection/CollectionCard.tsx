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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="h-full flex"
    >
      <Link
        href={`/product-details/${productId}/${slugify(productTitle || "").toLowerCase()}`}
        className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10
          bg-zinc-900/40 backdrop-blur-sm cursor-pointer transition-all duration-300 
          hover:border-ma-primary/60 hover:bg-zinc-900/80 hover:-translate-y-1.5 
          hover:shadow-[0_10px_30px_-10px_rgba(232,147,71,0.2)] min-h-[360px] h-full w-full block"
      >
        {/* Subtle top ambient lighting on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ma-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />

        {/* Image area */}
        <div className="relative w-full flex-1 overflow-hidden bg-black/30" style={{ minHeight: "220px" }}>
          <Image
            src={
              productThumbNail
                ? `${baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL}${productThumbNail.startsWith("/") ? "" : "/"
                }${productThumbNail}`
                : "/logo.png"
            }
            alt={productTitle || "Product Image"}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-108"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/* Promotion Discount Badge */}
          {hasDiscount && discountLabel ? (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-[0.65rem] font-black px-2.5 py-1 rounded-full uppercase tracking-wider z-20 shadow-md">
              {discountLabel} SALE
            </div>
          ) : (
            index < 2 && (
              <div className="absolute top-3 left-3 bg-ma-primary text-black text-[0.65rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider z-20 shadow-sm">
                NEW
              </div>
            )
          )}
        </div>

        {/* Content area */}
        <div className="px-5 py-4 flex flex-col gap-1.5 flex-1 justify-end bg-gradient-to-t from-black/60 to-transparent">
          <span className="text-ma-primary text-[0.65rem] font-bold uppercase tracking-[0.15em]">
            {subCategoryName || "Tackle Equipment"}
          </span>
          <h3 className="text-white/90 font-bold text-sm leading-snug line-clamp-2 uppercase group-hover:text-ma-primary transition-colors duration-200">
            {productTitle}
          </h3>

          {/* Price Section */}
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className="text-ma-primary font-extrabold text-lg tracking-tight">
              {numericConverter(String(finalPrice))}
            </span>

            {hasDiscount && (
              <span className="text-white/40 line-through text-xs font-semibold">
                {numericConverter(String(currentMinPrice))}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}