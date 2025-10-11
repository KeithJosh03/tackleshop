import Image from "next/image";
import Link from "next/link";
import { worksans, inter } from "@/types/fonts";
import { ProductCollectionProps } from "@/types/dataprops";
import { slugify } from "@/utils/slugify";

export default function CollectionCard({ product }: { product: ProductCollectionProps }) {
  const { productId, basePrice, brandName, productName, url,categoryType } = product;

  let numericPrice = Number(basePrice);

  let formattedPrice = numericPrice.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP"
  });

  return (
    <Link href={`/product/${productId}/${slugify(productName)}`}>
      <div
      className={`
      ${worksans.className}
      group relative flex flex-col items-center justify-start
      rounded-xl border border-greyColor hover:border-primaryColor
      text-left
      transition-all duration-300 hover:-translate-y-1
      p-5 h-full `}>
        <div
        className="relative w-full aspect-square flex items-center justify-center
        overflow-hidden rounded-lg bg-blackgroundColor"
        >
          <Image
            src={`/product${url}`}
            alt={brandName || productName}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 cards-tag">
              {brandName}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center mt-5 w-full">
          <h3
          className="
            font-bold text-[0.95rem] sm:text-[1.05rem] text-primaryColor 
            leading-snug line-clamp-2 h-[2.7rem]
          "
          >
            {productName}
          </h3>
          <p className="font-medium text-[0.85rem] text-gray-400 mt-1">
            {categoryType}
          </p>
          <p
          className={`${inter.className} font-semibold text-[1rem] sm:text-[1.0rem] text-primaryColor mt-2`}
          >
           {formattedPrice}
          </p>
        </div>
      </div>
    </Link>
  );
}
