import React from 'react'

export default function MainLayoutCollection(
  { children, }: { children: React.ReactNode }
) {
  return (
    <section
      className='flex h-fit w-full flex-col items-center justify-center gap-y-14 px-4 py-16 sm:px-6 lg:px-8 xl:px-16 2xl:px-44'
      id='collections'
    >
      {children}
    </section>
  )
}
