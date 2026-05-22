import React from 'react';
import { Header, Footer } from '@/components';


export default function BrandLayout(
  { children, }: { children: React.ReactNode }
) {
  return (
  <>
  <Header />
    <div className='relative w-full px-40 mt-40 mb-10'>
      {children}
    </div>
  <Footer />
  </>
  )
}

