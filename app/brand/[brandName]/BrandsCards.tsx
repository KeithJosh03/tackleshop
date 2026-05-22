import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { numericConverter } from "@/utils/priceUtils";
import { BrandProducts } from "@/types/dataprops";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function BrandsCards({ product, index }: { product: BrandProducts; index: number }) {
  const { basePrice, categoryType, mainImage, productId, productName } = product;

  return (
    <Link
      href={`/product/${productId}/${slugify(productName).toLowerCase()}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-greyColor
        bg-blackgroundColor/70 backdrop-blur-sm cursor-pointer
        transition-all duration-300
        hover:border-primaryColor
        min-h-[220px] h-full
      "
      style={{ boxShadow: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 22px 3px rgba(232,147,71,0.2)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Image Area */}
      <div className="relative w-full flex-1 overflow-hidden bg-mainBackgroundColor min-h-[160px]">
        <Image
          src={`${baseURL}/product/${mainImage}`}
          alt={productName}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-108"
          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>

      {/* Slide-up info overlay */}
      <div className={`
        absolute bottom-0 left-0 right-0
        bg-gradient-to-t from-blackgroundColor/95 via-blackgroundColor/80 to-transparent
        px-4 py-4
        translate-y-full group-hover:translate-y-0
        transition-transform duration-350 ease-out
        flex flex-col gap-y-0.5
        z-20
      `}>
        <span className="text-primaryColor text-[0.7rem] font-semibold uppercase tracking-widest">
          {categoryType}
        </span>
        <h3 className="text-tertiaryColor font-bold text-sm leading-snug line-clamp-2">
          {productName}
        </h3>
        <div className="text-primaryColor font-bold text-sm mt-1">
          {numericConverter(String(basePrice))}
        </div>
      </div>

      {/* Always-visible bottom label (non-hover state) */}
      <div className="px-4 py-3 flex flex-col group-hover:opacity-0 transition-opacity duration-200">
        <h3 className="font-bold text-primaryColor leading-snug line-clamp-1 text-sm">
          {productName.toUpperCase()}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-500 text-[0.75rem] uppercase">{categoryType}</p>
          <p className="text-tertiaryColor font-semibold text-xs">{numericConverter(String(basePrice))}</p>
        </div>
      </div>
    </Link>
  );
}
