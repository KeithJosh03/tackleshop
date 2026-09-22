import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { CategoryProps } from '@/types/dataprops';
import { SubCategory } from '@/types/subCategoryTypes';
import { BrandProps } from '@/types/brandType';

interface SearchTextProps {
  placeholderText: string;
  value: string;
  choosen:
  | BrandProps
  | CategoryProps
  | SubCategory
  | undefined
  | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}

const SearchText: React.FC<SearchTextProps> = ({
  placeholderText,
  value,
  onChange,
  choosen,
  onClear,
  onFocus,
  onBlur,
  disabled = false,
}) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholderText}
        value={value.toUpperCase()}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full bg-[#16202c] border border-greyColor/30 rounded-lg pl-4 pr-10 py-2.5 text-sm text-[#d9e3f4] focus:outline-none focus:border-primaryColor/60 transition-all placeholder:text-[#a6a7a6]/50 disabled:opacity-50 disabled:cursor-not-allowed ${choosen && value !== '' ? 'border-primaryColor/40 bg-[#16202c]/90' : ''
          }`}
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto">
        {choosen || value ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="w-5 h-5 flex items-center justify-center rounded-full bg-[#2c3542] text-[#a6a7a6] hover:bg-[#ffb4ab]/20 hover:text-[#ffb4ab] transition-colors"
            title="Clear selection"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <ChevronDown className="w-4 h-4 text-[#a6a7a6]/60 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default SearchText;
