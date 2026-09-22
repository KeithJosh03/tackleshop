'use client';

import React, { useEffect, useState } from 'react';

import { showSubCategory } from '@/lib/api/categoryService';
import { CategoryProps } from '@/types/categoryType';
import { SubCategory } from '@/types/subCategoryTypes';

import DropDownText from '@/components/ui/DropDownText';
import SearchText from '../SearchText';

import { ProductFormAction } from '@/lib/reducer/productFormReducer';

interface SubCategorySelectionProps {
  currentCategory?: CategoryProps | null;
  currentSubCategory?: SubCategory | null;
  ReducerType: 'EDIT' | 'CREATE' | 'FILTER';
  dispatchProductDetailCreate?: React.Dispatch<ProductFormAction>;
  onSelectSubCategory?: (subCategory: SubCategory | null) => void;
}

const DashboardSelectSubCategory: React.FC<SubCategorySelectionProps> = ({
  currentCategory,
  ReducerType,
  currentSubCategory,
  dispatchProductDetailCreate,
  onSelectSubCategory,
}) => {
  const [subCategories, setSubCategories] = useState<SubCategory[] | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // 1. Fetch subcategories when currentCategory changes
  useEffect(() => {
    if (!currentCategory || !currentCategory.categoryId) {
      setSubCategories(null);
      setFilteredSubCategories([]);
      setSearchTerm('');
      setSelectedSubCategory(null);
      setLoading(false);
      return;
    }

    const fetchSubCategory = async () => {
      setLoading(true);
      try {
        const fetchSubCategories: SubCategory[] | null = await showSubCategory(Number(currentCategory.categoryId));
        const fetchedList = fetchSubCategories || [];
        setSubCategories(fetchedList);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories([]);
        setFilteredSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategory();
  }, [currentCategory]);

  // 2. Sync local selection with reducer state
  useEffect(() => {
    if (currentSubCategory && currentSubCategory.subCategoryId) {
      setSelectedSubCategory(currentSubCategory);
      setSearchTerm(currentSubCategory.subCategoryName || '');
    } else {
      setSelectedSubCategory(null);
      setSearchTerm('');
    }
  }, [currentSubCategory]);

  // 3. Filter dropdown list based on user search
  useEffect(() => {
    if (!subCategories) {
      setFilteredSubCategories([]);
      return;
    }

    if (!searchTerm || (selectedSubCategory && searchTerm === selectedSubCategory.subCategoryName)) {
      setFilteredSubCategories(subCategories);
    } else {
      setFilteredSubCategories(
        subCategories.filter((subCategory) =>
          subCategory.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, subCategories, selectedSubCategory]);

  const dispatchRemove = () => {
    if (dispatchProductDetailCreate) {
      dispatchProductDetailCreate({ type: 'SET_SUBCATEGORY', payload: null });
    }

    if (ReducerType === 'FILTER' && onSelectSubCategory) {
      onSelectSubCategory(null);
    }
  };

  const handleSelectSubCategory = (subCategory: SubCategory) => {
    if (dispatchProductDetailCreate) {
      dispatchProductDetailCreate({
        type: 'SET_SUBCATEGORY',
        payload: subCategory
      });
    }

    if (ReducerType === 'FILTER' && onSelectSubCategory) {
      onSelectSubCategory(subCategory);
    }

    setSelectedSubCategory(subCategory);
    setSearchTerm(subCategory.subCategoryName);
    setIsFocused(false);
  };

  const clearSearch = () => {
    dispatchRemove();
    setSelectedSubCategory(null);
    setSearchTerm('');
    if (subCategories) setFilteredSubCategories(subCategories);
  };

  const placeholder = loading
    ? "Loading subcategories..."
    : !currentCategory
      ? "Select a category first"
      : "Search Subcategory...";

  return (
    <div className="flex-1 flex flex-col relative w-full">
      <SearchText
        onClear={clearSearch}
        choosen={selectedSubCategory}
        placeholderText={placeholder}
        value={searchTerm}
        onChange={(e) => {
          const newText = e.target.value;
          setSearchTerm(newText);

          if (selectedSubCategory && newText !== selectedSubCategory.subCategoryName) {
            setSelectedSubCategory(null);
            dispatchRemove();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 250)}
        disabled={loading || !currentCategory}
      />
      {isFocused && !loading && currentCategory && (
        <ul className="absolute top-full left-0 right-0 mt-1.5 z-[100] list-none bg-[#16202c] border rounded-xl border-[#3d4859] shadow-2xl shadow-black/80 max-h-56 overflow-y-auto custom-scrollbar ring-1 ring-white/10 py-1">
          {filteredSubCategories.length > 0 ? (
            filteredSubCategories.map((subCategory) => (
              <DropDownText
                onClick={() => handleSelectSubCategory(subCategory)}
                key={subCategory.subCategoryId}
                indexKey={subCategory.subCategoryId}
                listName={subCategory.subCategoryName.toUpperCase()}
                isSelected={selectedSubCategory?.subCategoryId === subCategory.subCategoryId}
              />
            ))
          ) : (
            <li className="px-4 py-3 text-xs text-[#a6a7a6] text-center font-medium">
              No subcategories found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DashboardSelectSubCategory;