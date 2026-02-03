import React from 'react';

interface InputTextProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  className?: string; 
}

const InputText: React.FC<InputTextProps> = ({
value,
onChange,
placeholder,
type = 'text',
className = '' 
}) => { 
  



  return (
    <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={ `border text-base p-2 placeholder:text-base placeholder:text-secondary rounded-md w-full outline-none border-primaryColor text-primaryColor ${className}`}
    />
  );
};

export default InputText;