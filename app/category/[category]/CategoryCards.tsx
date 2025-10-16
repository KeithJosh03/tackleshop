"use client";

import Image from "next/image";
import { worksans, inter } from "@/types/fonts";
import { CategorizeProduct } from "@/types/dataprops";

import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { motion } from "framer-motion";

export default function CategoryCards({ product, index } : { product: CategorizeProduct; index: number }) {

  return (
    <Link href={`/product/${product.productId}/${slugify(product.productName)}`}>
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
            src={`/product/${product.imageThumbNail}`}
            alt={product.productName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-grow justify-between items-center text-center text-tertiaryColor w-full mt-3">
          <h3 className="font-bold text-lg text-primaryColor line-clamp-1">
            {product.brandName}
          </h3>
          <p className="font-normal line-clamp-2">{product.productName}</p>
          <p className={`${inter.className} font-medium text-base text-primaryColor`}>
            ₱ {product.basePrice}
          </p>
          <p className='text-secondary'>{product.typeName}</p>
        </div>
      </motion.div>
    </Link>
  );
}
