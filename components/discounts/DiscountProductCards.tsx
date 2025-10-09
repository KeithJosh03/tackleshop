'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { worksans } from '@/types/fonts';
import { DiscountProductCollection } from '@/types/dataprops';

import slugify from 'slugify';



export default function DiscountProductCards({ discountProduct }: { discountProduct: DiscountProductCollection }) {
    
    const { 
    brandName, 
    discountType, 
    discountValue,
    imageThumbNail, 
    productModel,
    productPrice,
    variantId,
    productId 
    } = discountProduct

    const discountedPrice = (parseFloat(productPrice) - parseFloat(discountValue)).toFixed(2);
    const savings = parseFloat(discountValue);
    
    
  return (
    <>
    <Link href={`/product/${productId}/${slugify(productModel)}/${variantId}`}>
        <div
        className={`${worksans.className} setup-card p-2 items-center justify-items-center`}
        >
            <div className="relative w-full aspect-[4/3]">
                <Image
                src={`/product${imageThumbNail}`}
                alt={productModel}
                fill
                className="object-cover rounded-t-xl"
                sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-2 left-2 bg-primaryColor text-white text-base font-bold px-3 py-1 rounded-md shadow">
                    {brandName}
                </div>
            </div>
            <div className="flex flex-col gap-2 px-4 py-3 text-center text-tertiaryColor">
                <h3 className="text-lg font-semibold text-primaryColor">{productModel}</h3>
                
                <div className="flex flex-col items-center">
                    <p className="text-sm line-through opacity-70">₱ {productPrice.toLocaleString()}</p>
                    <p className="text-xl font-bold text-primaryColor">₱ {discountedPrice.toLocaleString()}</p>
                    <p className="text-xs text-green-400 font-medium">
                        You save ₱{savings.toLocaleString()}!
                    </p>
                </div>
            </div>
            <button className='button-view text-md font-extrabold self-center m-auto'>Click for more Info</button>
        </div>
    </Link>
    </>
  );
}
