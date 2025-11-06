import React from 'react'

export default function DashboardLayoutMain(
  { children, }: { children: React.ReactNode }
) {
  return (
    <main className='col-span-8 w-full'>
      {children}
    </main>
  )
}
