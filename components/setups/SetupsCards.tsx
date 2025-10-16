'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { worksans } from '@/types/fonts';
import { SetupCollection } from '@/types/dataprops';
import slugify from 'slugify';

export default function SetupsCards({ setupProduct }: { setupProduct: SetupCollection }) {
  const {
    setupId,
    setupName,
    valueDiscount,
    codeName,
    setupImageThumbNail,
    totalProductPrice,
    packages,
  } = setupProduct;

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
      const discountedPrice = (parseFloat(totalProductPrice) - parseFloat(valueDiscount)).toFixed(2);
      return numericConverter(discountedPrice);
  };

  return (
    <>
    <Link href={`/promo/code=${slugify(codeName).toLowerCase()}/set/${setupId}`}>
      <div
        className={`${worksans.className} setup-card p-2 items-center justify-items-center group flex flex-col h-full`}
      >
        <div className="relative w-full aspect-[4/3] bg-blackgroundColor rounded-t-xl overflow-hidden">
          <Image
            src={`/setups/${setupImageThumbNail}`}
            alt={codeName}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-2 left-2 cards-tag">
            CODE: {codeName}
          </div>
        </div>

        <div className="flex flex-col gap-2 px-4 py-2 text-center text-tertiaryColor flex-1 w-full">
          <h3 className="text-lg font-semibold text-primaryColor min-h-[3.25rem] overflow-hidden">{`${setupName} Setup`}</h3>

          <div className="flex flex-col items-center">
            <p className="text-sm line-through opacity-70">{numericConverter(totalProductPrice)}</p>
            <p className="text-xl font-bold text-primaryColor">{UnitPriceDiscount()}</p>
            <p className="text-xs text-green-400 font-medium">
              You save {numericConverter(valueDiscount)}!
            </p>
          </div>
          <div className="mt-1 text-left bg-blackgroundColor rounded-lg p-1 border border-greyColor">
            <p className="text-sm text-gray-400 font-semibold">In this setup:</p>
            {packages.slice(0, 3).map((pkg, i) => (
              <div key={i} className="text-sm text-gray-300 text-wrap">
                <span className="font-medium text-primaryColor">{pkg.categorytypeName}:</span>{' '}
                {pkg.productName}
              </div>
            ))}
          </div>
          <button className='button-view text-md font-extrabold self-center mt-auto group-hover:text-tertiaryColor group-hover:bg-primaryColor'>Click for more Info</button>
        </div>
      </div>
    </Link>
    </>
  );
}
