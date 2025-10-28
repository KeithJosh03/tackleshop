import React from 'react';
import Image from 'next/image';

interface IconButtonProps {
  icon: string;    
  altText: string;   
  text: string; 
  onClick: () => void;  
  className?: string;  
  iconSize?: number;  
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  altText,
  onClick,
  className = '',
  iconSize = 8,
}) => {
  return (
    <button
      onClick={onClick}
      className={`h-${iconSize} w-${iconSize} relative cursor-pointer hover:bg-secondary rounded-4xl group ${className}`}
    >
      <Image
        src={icon}
        alt={altText}
        fill
        className="object-fill transition-all duration-300"
      />
    </button>
  );
}

export default IconButton;
