'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { worksans } from '@/types/fonts';
import { DiscountProductCollection } from '@/types/dataprops';

import slugify from 'slugify';



export default function SaleProductCards({ discountProduct }: { discountProduct: DiscountProductCollection }) {
    const { 
        productName,
        discountType, 
        discountValue,
        imageThumbNail, 
        productModel,
        productPrice,
        variantId,
        productId 
    } = discountProduct

    let numericConverter = (number:string) => {
        let numericPrice = Number(number)
        let formattedNumber = numericPrice.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return formattedNumber;
    }

    let UnitPriceDiscount: any = () => {
        const discountedPrice = (parseFloat(productPrice) - parseFloat(discountValue)).toFixed(2);
        return numericConverter(discountedPrice);
    };

    let PercentPriceDiscount: any = () => {
        const price = parseFloat(productPrice);
        const discountPercent = parseFloat(discountValue);
        const discountedPrice = (price - (price * discountPercent / 100)).toFixed(2);
        return numericConverter(discountedPrice);
    };


    return (
    <Link href={`/product/${productId}/${slugify(productName).toLowerCase()}/variant/${variantId}`}>
        <div
        className={`${worksans.className} group bg-mainBackgroundColor flex flex-col h-full rounded-lg border border-greyColor hover:border-primaryColor transition-all duration-300 hover:-translate-y-1`}
        >
            <div className="relative w-full aspect-[4/3] bg-blackgroundColor rounded-t-xl overflow-hidden">
                <Image
                src={`/product/${imageThumbNail}`}
                alt={productModel}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-2 left-2 cards-tag">
                SALE
                </div>
            </div>
            <div className="flex flex-col gap-2 p-4 text-left text-tertiaryColor flex-1 w-full">
                <h3 className="text-lg  text-primaryColor min-h-[3.25rem] text-center overflow-hidden">
                    <p className='font-semibold text-primaryColor'>{productName}</p>
                    <p className='font-normal text-secondary'>{productModel}</p>
                </h3>
                <h3 className=" min-h-[3.25rem] text-center overflow-hidden">{productModel}</h3>
                <div className="flex flex-col items-center">
                    <p className="text-sm line-through opacity-70">{numericConverter(productPrice)}</p>
                    <p className="text-xl font-bold text-primaryColor">{discountType === 'Unit' ? UnitPriceDiscount() : PercentPriceDiscount()}</p>
                    <p className="text-sm text-green-400 font-medium">
                    {discountType === 'Unit' ? `Discounted ${numericConverter(discountValue)}` : `%${discountValue} OFF`}
                    </p>
                </div>
            </div>
            <button className='button-view text-md font-extrabold self-center mt-auto mb-4 group-hover:text-tertiaryColor group-hover:bg-primaryColor'>Click for more Info</button>
        </div>
    </Link>
    );
}
