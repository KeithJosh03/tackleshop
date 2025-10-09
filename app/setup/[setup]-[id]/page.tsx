// app/setup/[setup]-[id]/page.tsx
import React from 'react'

interface ItemSetIdProps {
    params: {
        setup: string;
        id: string;
    }
}

export default function Set({ params }: ItemSetIdProps) {
  const { setup, id } = params;
  console.log(setup);
  console.log(id);

  return (
    <div>
      hello
    </div>
  )
}