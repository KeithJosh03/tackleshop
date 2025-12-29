'use client';
import React, { useEffect, useState } from 'react'
import { showSubCategory } from '@/lib/api/categoryService'
import { SubCategoryProps } from '@/types/dataprops'

import DropDownText from '@/components/DropDownText'
import SearchTextTest from '@/components/InputTextTest';

import { ProductDetailAction } from '../app/admin/dashboard/products/addproduct/page'


interface SubCategorySelectionProps {
  categoryId: number;
  dispatchProductDetail: React.Dispatch<ProductDetailAction>; 
}

const DashboardSelectSubCategory: React.FC<SubCategorySelectionProps> = ({ categoryId ,dispatchProductDetail}) => {
  const [subCategories, setSubCategories] = useState<SubCategoryProps[] | null>(null);
  const [selectedSubCategory, setSelectedCategory] = useState<SubCategoryProps | undefined>() 
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategoryProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if(categoryId === null){
        clearInputs();
      dispatchProductDetail({
        type:'SELECT_SUBCATEGORY_DELETE',
      })
      return;
    }
    const fetchSubCategory = async () => {
      try {
        const fetchSubCategories: SubCategoryProps[] | null = await showSubCategory(categoryId);
        setSubCategories(fetchSubCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setLoading(false);
      }
    };

    fetchSubCategory();
  }, [categoryId]);

  useEffect(() => {
    if(selectedSubCategory?.subCategoryName.toLowerCase() === searchTerm.toLowerCase()){
      setFilteredSubCategories([])
      return;
    } else {
      setSelectedCategory(undefined)
    }

    if (subCategories) {
      setFilteredSubCategories(
        subCategories.filter((subCategory) =>
          subCategory.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, subCategories]);

  const clearInputs = () => {
    setSearchTerm('')
    setSelectedCategory(undefined)
    setFilteredSubCategories([])
  }

  const handleSelectSubCategory = (subCategory: SubCategoryProps) => {
    setSelectedCategory(subCategory)
    setSearchTerm(subCategory.subCategoryName); 
    dispatchProductDetail({
    type:'SELECT_SUBCATEGORY',
    payload:subCategory.subCategoryId
    })
  };

  const clearSearch = () => {
    clearInputs();
    dispatchProductDetail({
      type:'SELECT_SUBCATEGORY_DELETE',
    })
  }



  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-primaryColor text-xl">SELECT SUBCATEGORY</h1>
      <SearchTextTest 
        onClear={clearSearch}
        choosen={selectedSubCategory}
        placeholderText="Search Subcategory"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredSubCategories.length > 0 && (
        <ul className="list-none bg-secondary border rounded border-primaryColor text-base max-h-40 overflow-y-auto">
          {filteredSubCategories.map((subCategory) => (
            <DropDownText 
              onClick={() => handleSelectSubCategory(subCategory)} 
              key={subCategory.subCategoryId} 
              indexKey={subCategory.subCategoryId} 
              listName={subCategory.subCategoryName}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardSelectSubCategory;
