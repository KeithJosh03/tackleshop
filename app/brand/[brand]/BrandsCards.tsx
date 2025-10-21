"use client";

import Image from "next/image";
import { worksans, inter } from "@/types/fonts";

import { BrandProducts } from "@/types/dataprops";

import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { motion } from "framer-motion";

export default function BrandsCards({ product, index }: { product: BrandProducts; index: number }) {

  let numericConverter = (number: number | undefined) => {
    let numericPrice = Number(number);
    let formattedNumber = numericPrice.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formattedNumber;
  };


  const {basePrice ,categoryType ,mainImage ,productId ,productName, discount} = product
  return (
    <Link href={`/product/${productId}/${slugify(productName)}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.15,
          ease: "easeOut",
        }}
        className={`${worksans.className} collection-card flex flex-col items-center justify-between rounded-lg shadow p-3 h-full`}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded">
          <Image
            src={`/product/${mainImage}`}
            alt={productName}
            fill
            className="object-cover"
          />
          {discount && (
          <div className="absolute top-2 left-2 cards-tag">
            Sale
          </div>
          )}
        </div>
        <div className="flex flex-col flex-grow justify-between items-center text-center text-tertiaryColor w-full mt-3">
          <h3 className="font-bold text-lg text-primaryColor line-clamp-1">
            {productName}
          </h3>
          <p className="font-normal line-clamp-2">{categoryType}</p>
          <p className={`${inter.className} font-medium text-base text-primaryColor`}>
          {numericConverter(basePrice)}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
