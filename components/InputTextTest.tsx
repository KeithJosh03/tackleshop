import React from 'react';
import { BrandProps,CategoryProps,SubCategoryProps } from '@/types/dataprops';


interface SearchTextTestProps {
  placeholderText: string;
  value: string;
  choosen: BrandProps | CategoryProps | SubCategoryProps | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void; 
}

const SearchTextTest: React.FC<SearchTextTestProps> = ({
  placeholderText,
  value,
  onChange,
  choosen,
  onClear,
}) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        className={`border p-2 pr-8 placeholder:text-base rounded-md w-full outline-none border-primaryColor ${
          choosen && value !== '' ? 'text-primaryColor bg-secondary' : 'text-secondary'
        }`}
      />

      {choosen && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-primaryColor hover:text-primaryColor"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchTextTest;
