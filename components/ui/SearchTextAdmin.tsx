import React, { InputHTMLAttributes } from 'react';

export interface SearchTextAdminProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholderText?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const SearchTextAdmin: React.FC<SearchTextAdminProps> = ({
  placeholderText,
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <input
      type="text"
      placeholder={placeholderText}
      value={value}
      onChange={onChange}
      className={`w-full bg-[#0a1420] border border-[#303a47] focus:border-primaryColor/60 focus:ring-1 focus:ring-primaryColor/30 rounded-lg px-4 py-2.5 text-sm font-medium text-white placeholder:text-[#a6a7a6]/50 outline-none transition-all duration-200 shadow-sm ${className}`}
      {...props}
    />
  );
};

export default SearchTextAdmin;
