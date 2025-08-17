import React from 'react'

// import { Header, Footer } from '@/components'

export default function CategoryLayout(
  { children, }: { children: React.ReactNode }
) {
  return (
  <div className='relative h-screen w-full px-14'>
    {children}
  </div>
  )
}
