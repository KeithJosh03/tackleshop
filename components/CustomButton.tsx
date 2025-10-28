import React from 'react';
import Image from 'next/image';

interface CustomButtonProps {
  text: string; 
  onClick: () => void;  
  className?: string;  
  iconSize?: number;  
}



const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className='button-view text-md font-extrabold'
    >
    {text}
    </button>
  );
}

export default CustomButton;