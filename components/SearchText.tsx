import React from 'react';
import { 
  CategoryProps,
} from '@/types/dataprops';

import { SubCategory } from '@/types/subCategoryTypes';

import { BrandProps } from '@/types/brandType';

import { ProductListDashboard } from '@/lib/api/productService';

interface SearchTextProps {
  placeholderText: string;
  value: string;
  choosen: BrandProps | CategoryProps | SubCategory | ProductListDashboard | undefined | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void; 
}


const SearchText: React.FC<SearchTextProps> = ({
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

export default SearchText;
