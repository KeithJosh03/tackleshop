import Image from "next/image"
import { worksans, inter } from "@/types/fonts"
import { ProductProps } from "@/types/dataprops";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export default function CollectionCard({ product }: { product: ProductProps }) {
  return (
    <Link 
    href={`/product/${product.product_id}/${slugify(product.product_name)}`}
    >
      <div
        className={`${worksans.className} collection-card flex flex-col items-center justify-between rounded-lg shadow p-3 h-full`}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded">
          <Image
            src={`/product${product.product_variant[0].main_image.url}`}
            alt={`${product.brand.brand_name}`}
            fill
            className="object-contain"
          />
        </div>

        <div className="flex flex-col flex-grow justify-between items-center text-center text-tertiaryColor w-full mt-3">
          <h3 className="font-bold text-lg text-primaryColor line-clamp-2">
            {product.product_name}
          </h3>
          <p className="font-normal">{product.brand.brand_name}</p>
          <p className={`${inter.className} font-medium text-base text-primaryColor`}>₱ {product.base_price}</p>
        </div>
      </div>
    </Link>
  )
}
