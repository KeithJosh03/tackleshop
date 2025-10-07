import Image from "next/image"
import { worksans, inter } from "@/types/fonts"

import { ProductCollectionProps } from "@/types/dataprops";

import Link from "next/link";
import { slugify } from "@/utils/slugify";

export default function CollectionCard({ product }: { product: ProductCollectionProps }) {
  let {
  productId,
  basePrice,
  brandName,
  productName,
  url
  } = product;
  return (
    <Link 
    href={`/product/${productId}/${slugify(productName)}`}
    >
      <div
        className={`${worksans.className} collection-card flex flex-col items-center justify-between rounded-lg shadow p-3 h-full`}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded">
          <Image
            src={`/product${url}`}
            alt={`${brandName}`}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex flex-col flex-grow justify-between items-center text-center text-tertiaryColor w-full mt-3">
          <h3 className="font-bold text-lg text-primaryColor line-clamp-2">
            {productName}
          </h3>
          <p className="font-normal">{brandName}</p>
          <p className={`${inter.className} font-medium text-base text-primaryColor`}>₱ {basePrice}</p>
        </div>
      </div>
    </Link>
  )
}
