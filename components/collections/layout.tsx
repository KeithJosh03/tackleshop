import React from 'react'

import { worksans } from '@/types/fonts'

export default function MainLayoutCollection({
    children,
}:{
    children:React.ReactNode
}) {
  return (
    <div className={`${worksans.className} h-fit w-full flex flex-col items-center justify-center px-28 py-6 gap-y-20`}>
        {children}
    </div>
  )
}
