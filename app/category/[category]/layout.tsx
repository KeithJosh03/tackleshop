import React from 'react'
import { Header, Footer } from '@/components'

export default function CategoryLayout(
  { children, }: { children: React.ReactNode }
) {
  return (
    <>
      <Header />
      <div className="relative w-full px-4 sm:px-10 lg:px-40 mt-20 mb-10">
        {children}
      </div>
      <Footer />
    </>
  )
}
