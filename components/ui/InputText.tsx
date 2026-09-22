import React, { InputHTMLAttributes } from 'react';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> { }

const InputText: React.FC<InputTextProps> = ({
  value = '',
  onChange,
  placeholder,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full bg-[#0a1420] border border-[#303a47] focus:border-primaryColor/60 focus:ring-1 focus:ring-primaryColor/30 rounded-lg px-4 py-2.5 text-sm font-medium text-white placeholder:text-[#a6a7a6]/50 outline-none transition-all duration-200 shadow-sm ${className}`}
      {...props}
    />
  );
};

export default InputText;