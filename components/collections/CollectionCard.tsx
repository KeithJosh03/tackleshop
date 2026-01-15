import Image from "next/image";
import Link from "next/link";
import { worksans, inter } from "@/types/fonts";
import { slugify } from "@/utils/slugify";

import { numericConverter } from "@/utils/priceUtils";
import { ProductCollections } from "@/lib/api/categoryService";

export default function CollectionCard({ product }: { product: ProductCollections }) {
  const { 
    productId, 
    basePrice, 
    brandName, 
    productTitle, 
    productThumbNail,
    subCategoryName 
  } = product;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
  return (
    <Link 
    href={`/product/${productId}/${slugify(productTitle).toLowerCase()}`}>
      <div
      className={`
      ${worksans.className}
      group relative flex flex-col items-center justify-start border border-greyColor
      rounded-xl hover:border hover:border-primaryColor
      bg-blackgroundColor
      text-left
      transition-all duration-300 hover:-translate-y-1
      p-5 h-full`}>
        <div
        className="relative w-full aspect-square flex items-center justify-center
        overflow-hidden rounded-lg bg-mainBackgroundColor"
        >
          <Image
            src={`${baseURL}${productThumbNail}`} 
            alt={`${brandName}` || `${productTitle}`}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
          {/* {discountType && (
          <div className="absolute top-2 left-2 cards-tag">
            Sale
          </div>
          )} */}
        </div>
        <div className="flex flex-col items-center justify-center text-center mt-5 w-full">
          <h3
          className="
            font-bold text-[0.95rem] sm:text-[1.05rem] text-primaryColor 
            leading-snug line-clamp-2 h-[2.7rem]
          "
          >
            {productTitle.toUpperCase()}
          </h3>
          <p className="font-medium text-[0.85rem] text-gray-400 mt-1">
            {subCategoryName.toUpperCase()}
          </p>
          <p
          className={`${inter.className} font-semibold text-[1rem] sm:text-[1.0rem] text-primaryColor mt-2`}
          >
          {numericConverter(String((basePrice)))}
          </p>
        </div>
      </div>
    </Link>
  );
}
