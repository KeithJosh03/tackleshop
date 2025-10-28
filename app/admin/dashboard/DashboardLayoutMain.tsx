import React from 'react'

export default function DashboardLayoutMain(
  { children, }: { children: React.ReactNode }
) {
  return (
    <main className='basis-4/5 p-4 w-full'>
      {children}
    </main>
  )
}
