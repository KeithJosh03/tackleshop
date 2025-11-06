import React from 'react';

interface InputTextProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  className?: string; 
  isNumber?:boolean;
}

const InputText: React.FC<InputTextProps> = ({
value,
onChange,
placeholder,
isNumber = false,
type = 'text',
className = '' 
}) => { 
  
  let numericConverter = (number: string | undefined) => {
    let numericPrice = Number(number);
    let formattedNumber = numericPrice.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formattedNumber;
  };


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
