import React from 'react';
import {
  CategoryProps,
} from '@/types/dataprops';

import { SubCategory } from '@/types/subCategoryTypes';

import { BrandProps } from '@/types/brandType';

// import { ProductListDashboard } from '@/lib/api/productService';

interface SearchTextProps {
  placeholderText: string;
  value: string;
  choosen:
  BrandProps | CategoryProps |
  SubCategory | undefined |
  null;
  // ProductListDashboard
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchText: React.FC<SearchTextProps> = ({
  placeholderText,
  value,
  onChange,
  choosen,
  onClear,
  onFocus,
  onBlur,
}) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full bg-transparent px-4 py-2.5 text-sm text-[#d9e3f4] focus:outline-none placeholder:text-[#a6a7a6]/50 transition-colors ${choosen && value !== '' ? 'bg-[#212b37]/50' : ''}`}
      />

      {choosen && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-[#2c3542] text-[#a6a7a6] hover:bg-[#a18d7f]/40 hover:text-[#d9e3f4] transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchText;
