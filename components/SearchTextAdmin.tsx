import React from 'react';

interface SearchTextAdminProps {
  placeholderText: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchTextAdmin: React.FC<SearchTextAdminProps> = ({ placeholderText, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholderText}
      value={value}
      onChange={onChange}
      className="border p-2 placeholder:text-base rounded-md w-full outline-none border-primaryColor text-secondary"
    />
  );
}

export default SearchTextAdmin;
