import React from 'react'

export default function CardsLayoutCategory (
    { children } : {children:React.ReactNode} 
){
  return (
    <div className='grid grid-cols-5 grid-flow-row gap-4'>
        { children }
    </div>
  )
}
