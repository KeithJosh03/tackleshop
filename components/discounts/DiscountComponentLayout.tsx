import React from 'react'
import { worksans } from '@/types/fonts';

export default function DiscountComponentLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div
    className={`${worksans.className} h-fit w-full flex flex-col items-center justify-center 
    transition-all duration-700 ease-out`}
    >
      <h1 className="text-primaryColor font-extrabold text-2xl mb-4 md:text-4xl">
        Discounts
      </h1>
      <div className="relative w-full">
        <div
          className={`
          sm:grid sm:grid-cols-2 sm:gap-2
          lg:grid-cols-4 lg:gap-2
          xl:grid-cols-4
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

