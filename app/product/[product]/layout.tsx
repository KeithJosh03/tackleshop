import React from 'react'

export default function ProductLayout(
   { children, }:{ children:React.ReactNode},
) {
  return (
    <div className='relative h-screen w-full flex flex-col items-center justify-center'>
        {children}
    </div>
  )
}
