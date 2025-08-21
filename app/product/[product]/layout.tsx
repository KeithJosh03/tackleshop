import React from 'react'

export default function ProductLayout(
   { children, }:{ children:React.ReactNode},
) {
  return (
    <div className='relative h-screen w-full px-40'>
      <div className='grid grid-cols-2'>
        {children}
      </div>
    </div>
  )
}
