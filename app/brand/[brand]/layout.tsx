import React from 'react'

export default function BrandLayout(
  { children, }: { children: React.ReactNode }
) {
  return (
  <div className='relative w-full px-40'>
    {children}
  </div>
  )
}
