import Image from "next/image"
import { worksans,inter } from "@/types/fonts"
import { products } from "@/types/products";
import { ProductProps } from "@/types/dataprops";

import Link from "next/link";


export default function CollectionCard({ product }: { product: ProductProps }) {
  return (
    <Link href={`/product/${product.product_name.replace(/ /g, '-').toLowerCase()}`}>
      <div className={`${worksans.className} collection-card`}>
          <div className="relative w-full aspect-[4/4] overflow-hidden rounded">
              <Image
              src={products.shimano}
              alt={`${product.brand.brand_name}`}
              fill
              className="object-cover" 
              />
          </div>
          <div className={`${worksans.className} flex flex-col text-lg w-full justify-center items-center text-center text-tertiaryColor`}>
              <h3 className='font-bold text-lg text-primaryColor'>
              {`${product.product_name}`}
              </h3>
              <p className="font-normal">{`${product.brand.brand_name}`}</p>
              <p className={`${inter.className} font-normal text-sm`}>{`₱ ${product.base_price}`}</p>
          </div>
      </div>
    </Link>
    
  )
}
