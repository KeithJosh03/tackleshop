import React from 'react'

export default function DashBoardButtonLayoutOption({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <div className='flex flex-row space-x-2 justify-center items-center p-4'>
    {children}
  </div>
  )
}
