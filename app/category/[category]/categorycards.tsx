import Image from "next/image"

import { worksans,inter } from "@/types/fonts"
import { products } from "@/types/products";
import { ProductProps } from "@/types/dataprops";

export default function CategoryCards(
    { product } : {product : ProductProps}
) {
console.log(product);
  return (
    <div className={`${worksans.className} h-fit basis-1/4 border-2 px-4 py-2 flex flex-col gap-y-2 items-center border-greyColor transition-all rounded-xl hover:border-primaryColor`}>
        <div className="relative w-full aspect-[4/4] overflow-hidden rounded">
            <Image
            src={products.shimano}
            alt={product.product_name}
            fill
            className="object-cover" 
            />
        </div>
        <div className={`${worksans.className} flex flex-col text-lg w-full justify-center items-center text-center text-tertiaryColor`}>
            <h3 className='font-bold text-lg text-primaryColor'>
            {`${product.brand.brand_name}`}
            </h3>
            <p className="font-normal">{`${product.product_name}`}</p>
            <p className={`${inter.className} font-normal text-sm`}>{`₱ ${product.base_price}`}</p>
        </div>
    </div>
  )
}
