import React from 'react'

import { worksans } from '@/types/fonts'

export default function MainLayoutCollection(
   { children, }:{ children:React.ReactNode}
){
  return (
    <section className={`${worksans.className} h-fit w-full flex flex-col items-center justify-center 2xl:px-80 xl:px-8 lg:px-16 md:px-8 sm:px-10 py-2 gap-y-16`}>
      {children}
    </section>
  )
}
