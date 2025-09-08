import React from 'react'

export default function CategoryLayout(
  { children, }: { children: React.ReactNode }
) {
  return (
  <div className='relative w-full px-40'>
    {children}
  </div>
  )
}
