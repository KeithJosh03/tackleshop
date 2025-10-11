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
      <h1 className="text-primaryColor font-extrabold text-2xl md:text-4xl mb-4">
        Setups Promo
      </h1>
      <div className='relative w-full'>
        <div className='
          justify-items-center
          sm:grid sm:grid-cols-2 sm:gap-2
          md:grid md:grid-cols-2 md:gap-2
          lg:grid-cols-3 lg:gap-2
          xl:grid-cols-3'
        >
          {children}
        </div>
      </div>
    </div>
  );
}

