import React from 'react';

interface CustomButtonProps {
  text: string; 
  onClick: () => void;  
  className?: string;  
  iconSize?: number;  
}



const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  className = 'button-view text-md font-extrabold'
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className}`}
    >
    {text}
    </button>
  );
}

export default CustomButton;