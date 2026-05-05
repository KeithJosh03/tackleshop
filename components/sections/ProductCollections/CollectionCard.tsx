import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { numericConverter } from "@/utils/priceUtils";
import { ProductCollections } from "@/lib/api/categoryService";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/';

interface CollectionCardProps {
  product: ProductCollections;
}

export default function CollectionCard({ product }: CollectionCardProps) {
  const {
    productId,
    basePrice,
    brandName,
    productTitle,
    productThumbNail,
    subCategoryName,
  } = product;

  return (
    <Link
      href={`/product/${productId}/${slugify(productTitle).toLowerCase()}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-greyColor
        bg-blackgroundColor/70 backdrop-blur-sm cursor-pointer
        transition-all duration-300
        hover:border-primaryColor
        min-h-[400px]
      `}
      style={{ boxShadow: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 22px 3px rgba(232,147,71,0.2)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Image */}
      <div className="relative w-full flex-1 overflow-hidden bg-mainBackgroundColor">
        <Image
          src={`${baseURL}${productThumbNail}`}
          alt={productTitle}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-108"
          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Price badge */}
        <div className="absolute top-3 left-3 bg-primaryColor text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          {numericConverter(String(basePrice))}
        </div>
      </div>

      {/* Slide-up info overlay */}
      <div className={`
        absolute bottom-0 left-0 right-0
        bg-gradient-to-t from-blackgroundColor/95 via-blackgroundColor/80 to-transparent
        px-4 py-4
        translate-y-full group-hover:translate-y-0
        transition-transform duration-350 ease-out
        flex flex-col gap-y-0.5
      `}>
        <span className="text-primaryColor text-[0.7rem] font-semibold uppercase tracking-widest">
          {brandName}
        </span>
        <h3 className="text-tertiaryColor font-bold text-sm leading-snug line-clamp-2">
          {productTitle}
        </h3>
        <span className="text-gray-400 text-[0.72rem] uppercase tracking-wide mt-0.5">
          {subCategoryName}
        </span>
      </div>

      {/* Always-visible bottom label (non-hover state) */}
      <div className="px-4 py-3 flex flex-col group-hover:opacity-0 transition-opacity duration-200">
        <h3 className="font-bold text-primaryColor leading-snug line-clamp-2 text-base"
        >
          {productTitle.toUpperCase()}
        </h3>
        <p className="text-gray-500 text-[0.75rem] uppercase mt-0.5">{subCategoryName}</p>
      </div>
    </Link>
  );
}
