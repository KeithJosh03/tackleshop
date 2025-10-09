import React from 'react'
import { worksans } from '@/types/fonts';

export default function SetupsComponentLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div
    className={`${worksans.className} h-fit w-full flex flex-col items-center justify-center 
    transition-all duration-700 ease-out`}
    >
      <h1 className="text-primaryColor font-extrabold text-2xl md:text-4xl">
        Setups Promo
      </h1>
      <div className="w-full grid grid-cols-1 2xl:px-40 xl:px-20 sm:px-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 mt-10">
        {children}
      </div>
    </div>
  );
}

