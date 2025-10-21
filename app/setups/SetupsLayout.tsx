import React from 'react'

export default function SalesLayout (
    { children } : {children:React.ReactNode} 
){
  return (
    <div className="grid grid-cols-5 gap-4 items-stretch px-30">
      {children}
    </div>
  )
}
