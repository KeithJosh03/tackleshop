"use client";

import Image from "next/image";
import { worksans, inter } from "@/types/fonts";
import { CategorizeProduct } from "@/types/dataprops";
import { numericConverter } from "@/utils/priceUtils";

import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { motion } from "framer-motion";

export default function CategoryCards({ product, index } : { product: CategorizeProduct; index: number }) {
  const {basePrice, brandName, productThumbNail, productId, productTitle, subCategoryName} = product;
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

  console.log(product);

  return (
    <Link href={`/product/${productId}/${slugify(productTitle).toLowerCase()}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.15,
          ease: "easeOut",
        }}
        className={`${worksans.className} collection-card bg-blackgroundColor flex flex-col items-center justify-between rounded-lg shadow p-3 h-full`}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded">
          <Image
            src={`${baseURL}${productThumbNail}`} 
            alt={productTitle}
            fill
            className="object-cover"
          />
          {/* {discountType && 
            <div className="absolute top-2 left-2 cards-tag">
            Sale
            </div>
          } */}
        </div>
        <div className="flex flex-col flex-grow justify-between items-center text-center text-tertiaryColor w-full mt-3">
          <h3 className="font-bold text-lg text-primaryColor line-clamp-1">
            {productTitle}
          </h3>
          <p className="font-normal text-sm line-clamp-2">{brandName}</p>
          <p className={`${inter.className} font-medium text-sm text-greyColor`}>
            {subCategoryName}
          </p>
          <p className='text-primaryColor text-base'>{numericConverter(basePrice)}</p>
        </div>
      </motion.div>
    </Link>
  );
}
