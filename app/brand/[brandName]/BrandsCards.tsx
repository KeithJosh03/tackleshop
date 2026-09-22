import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { slugify } from "@/utils/slugify";
import { numericConverter } from "@/utils/priceUtils";
import { BrandProducts } from "@/types/dataprops";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

interface BrandsCardsProps {
  product: BrandProducts;
  index?: number;
}

export default function BrandsCards({ product, index = 0 }: BrandsCardsProps) {
  const { 
    basePrice, 
    minPrice,
    maxPrice,
    formattedPrice,
    categoryType, 
    mainImage, 
    productId, 
    productName 
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

  // 1. Resolve Image URL with Fallback
  const getImageUrl = () => {
    if (!mainImage) return '/logo.png';
    // If it's already a full HTTP URL (like from your updated resource)
    if (mainImage.startsWith('http')) return mainImage;
    const cleanBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    const cleanPath = mainImage.startsWith('/') ? mainImage : `/${mainImage}`;
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
        href={`/product-details/${productId}/${slugify(productName || '').toLowerCase()}`}
        className="group relative flex flex-col overflow-hidden rounded-md border border-[#323537]
          bg-[#1d2022] cursor-pointer transition-all duration-300 hover:border-[#ffc49a] min-h-[360px] h-full block"
      >
        {/* Image Area */}
        <div className="relative w-full flex-1 overflow-hidden bg-[#0b0f10]" style={{ minHeight: '240px' }}>
          <Image
            src={getImageUrl()}
            alt={productName || 'Product Image'}
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
          {categoryType && (
            <span className="text-[#ffc49a] text-[0.65rem] font-bold uppercase tracking-[0.1em]">
              {categoryType}
            </span>
          )}
          <h3 className="text-[#e0e3e5] font-bold text-sm leading-snug line-clamp-2 uppercase">
            {productName}
          </h3>
          <div className="mt-1 text-[#ffc49a] font-extrabold text-xl tracking-tight">
            {renderPrice()}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
