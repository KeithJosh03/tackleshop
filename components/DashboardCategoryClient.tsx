'use client';
import { worksans } from '@/types/fonts';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SubCategoryProps, CategorySubProps } from '@/types/dataprops';
import axios from 'axios';

import SearchTextAdmin from '@/components/SearchTextAdmin';
import DropDownText from '@/components/DropDownText';
import IconButton from '@/components/IconButton';
import DashBoardButtonLayoutOption from '@/components/DashBoardButtonLayoutOption';



import {
  CategoryProps,
  selectedCategorySubCategory,
  selectedCategorySubCategoriesProps,
  deleteCategory,
  editCategory,
  addCategory
} from '@/lib/api/categoryService';

import {
  addSubCategory,
  editSubCategory,
  deleteSubCategory
} from '@/lib/api/subCategoryService';

type Props = {
  categorylist: CategoryProps[];
};

export default function DashboardCategoryClient({ categorylist }: Props) {
  const [categories, setCategories] = useState<CategoryProps[]>(categorylist);
  const [subCategory, setsubCategory] = useState<selectedCategorySubCategoriesProps[]>([]);

  const [selectedCategory, setselectedCategory] = useState<CategoryProps | null>();
  const [selectedSubCategory, setselectSubCategory] = useState<selectedCategorySubCategoriesProps | null>();

  // Search
  const [searchCategory, setsearchCategory] = useState('');
  const [searchSubcategory, setsearchSubcategory] = useState('');

  // Create
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isCreatingSubcategory, setisCreatingSubcategory] = useState(false);
  const [newSubcategory, setnewSubcategory] = useState('');

  // Editing
  const [isEditingCategory, setisEditingCategory] = useState(false);
  const [newEditCategoryName, setEditCategoryName] = useState('');
  const [isEditingSubCategory, setisEditingSubCategory] = useState(false);
  const [newEditingSubCategoryName, setnewEditingSubCategoryName] = useState('');

  // Status Toast
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setStatusMessage(message);
    setStatusType(type);
    setTimeout(() => {
      setStatusMessage(null);
      setStatusType(null);
    }, 5000);
  };

  useEffect(() => {
    if (!selectedCategory?.categoryId) return;

    const fetchSubCategories = async () => {
      try {
        const subCategories = await selectedCategorySubCategory({
          categoryId: selectedCategory.categoryId,
        });
        setsubCategory(subCategories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubCategories();
  }, [selectedCategory?.categoryId]);

  const handleSearchChangeSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchSubcategory(e.target.value);
  };


  // ADD CATEGORY
  const handleAddCategory = async () => {
    if (!newCategory) return;

    const createdCategory = await addCategory({ category_name: newCategory });

    if (createdCategory) {
      setCategories([...categories, createdCategory]);
      setIsCreatingCategory(false);
      setNewCategory('');
      showToast(`Category "${createdCategory.categoryName}" added successfully.`, 'success');
    } else {
      showToast('Failed to add category.', 'error');
    }
  };

  // EDIT CATEGORY
  const handleEditCategory = async () => {
    if (!newEditCategoryName.length || !selectedCategory) return;

    const updatedCategory = await editCategory(selectedCategory.categoryId, {
      category_name: newEditCategoryName,
    });

    if (updatedCategory) {
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.categoryId === updatedCategory.categoryId
            ? { ...category, categoryName: updatedCategory.categoryName }
            : category
        )
      );
      setEditCategoryName('');
      setselectedCategory(null);
      setisEditingCategory(false);
      showToast(`Category updated successfully.`, 'success');
    } else {
      showToast("Failed to update category.", 'error');
    }
  };

  // DELETE CATEGORY
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    const categoryId = selectedCategory.categoryId;

    try {
      const success = await deleteCategory(categoryId);

      if (success) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.categoryId !== categoryId)
        );
        setselectedCategory(null);
        setsubCategory([]); // Clear subcategories when category is deleted
        showToast(`Category deleted successfully.`, 'success');
      } else {
        showToast('Failed to delete category.', 'error');
      }
    } catch (error) {
      showToast(`Error deleting category.`, 'error');
    }
  };

  // ADD SUBCATEGORY
  const handleAddSubCategegory = async () => {
    if (!selectedCategory || !newSubcategory.length) return;

    const createdSubCategory = await addSubCategory({
      category_id: selectedCategory.categoryId,
      sub_category_name: newSubcategory,
    });

    if (createdSubCategory) {
      setsubCategory([...subCategory, createdSubCategory]);
      setisCreatingSubcategory(false);
      setnewSubcategory('');
      showToast(`Subcategory "${createdSubCategory.subCategoryName}" added successfully.`, 'success');
    } else {
      showToast('Failed to add subcategory.', 'error');
    }
  };

  // EDIT SUBCATEGORY
  const handleEditSubCategory = async () => {
    if (!selectedSubCategory || !newEditingSubCategoryName.length) return;

    const updatedSubCategory = await editSubCategory(
      selectedSubCategory.subCategoryId,
      { sub_category_name: newEditingSubCategoryName }
    );

    if (updatedSubCategory) {
      setsubCategory((prevSubCategories) =>
        prevSubCategories.map((subcategory) =>
          subcategory.subCategoryId === updatedSubCategory.subCategoryId
            ? { ...subcategory, subCategoryName: updatedSubCategory.subCategoryName }
            : subcategory
        )
      );
      setisEditingSubCategory(false);
      setselectSubCategory(null);
      setnewEditingSubCategoryName('');
      showToast(`Subcategory updated successfully.`, 'success');
    } else {
      showToast('Failed to update subcategory.', 'error');
    }
  };

  // DELETE SUBCATEGORY
  const handleDeleteSubCategory = async () => {
    if (!selectedSubCategory) return;

    const success = await deleteSubCategory(selectedSubCategory.subCategoryId);

    if (success) {
      setsubCategory((prevSubcategories) =>
        prevSubcategories.filter(
          (subcategory) => subcategory.subCategoryId !== selectedSubCategory.subCategoryId
        )
      );
      setselectSubCategory(null);
      showToast(`Subcategory deleted successfully.`, 'success');
    } else {
      showToast('Failed to delete subcategory.', 'error');
    }
  };

  return (
    <div className='bg-blackgroundColor border border-greyColor rounded-xl shadow-sm p-6 w-full flex flex-col space-y-4 font-sans'>
      <div className="flex flex-col mb-2">
        <h2 className="text-primaryColor text-xl font-bold tracking-tight">
          CATEGORIES
          {categories.length === 0 && (
            <span className='text-secondary text-sm font-normal ml-2'> (No Categories Available)</span>
          )}
        </h2>
        <p className="text-secondary text-xs mt-1 font-medium text-opacity-80">Manage products categories and subcategories.</p>
      </div>
      <div className="flex items-center gap-x-3 text-base">
        <SearchTextAdmin
          placeholderText='Search Category'
          value={searchCategory}
          onChange={(e) => { setsearchCategory(e.target.value) }}
        />
        <IconButton
          icon='/icons/addicon.svg'
          altText='Add Icon'
          onClick={() => {
            setIsCreatingCategory(true)
            setselectedCategory(null)
            setselectSubCategory(null)
          }}
          iconSize={8}
        />
      </div>

      {categories.length > 0 && (
        <ul className="list-none bg-secondary/5 border rounded-lg border-greyColor text-sm mt-2 max-h-60 overflow-y-auto divide-y divide-greyColor/50 shadow-inner">
          {categories.map((category) => (
            <DropDownText
              key={category.categoryId}
              onClick={() => {
                setselectedCategory(category)
                setIsCreatingCategory(false)
                setselectSubCategory(null)
              }}
              indexKey={category.categoryId}
              listName={category.categoryName}
            />
          ))}
        </ul>
      )}

      {selectedCategory && (
        <div className="mt-6 text-primaryColor bg-secondary/5 border border-primaryColor/20 p-5 rounded-lg shadow-sm">
          <div className='flex flex-row justify-between items-center mb-4 pb-2 border-b border-greyColor/30'>
            <h3 className="text-sm font-semibold text-secondary">CATEGORY SELECTED: <span className='text-primaryColor font-bold'>{selectedCategory.categoryName.toUpperCase()}</span></h3>
            <IconButton
              icon='/icons/closeicon.svg'
              altText='close Icon'
              onClick={() => { setselectedCategory(null) }}
              iconSize={8}
            />
          </div>
          <div className="flex flex-col items-center gap-y-4">
            <DashBoardButtonLayoutOption>
              {!isEditingCategory ? (
                <>
                  <IconButton
                    icon='/icons/editicon.svg'
                    altText='close Icon'
                    onClick={() => { setisEditingCategory(true) }}
                    iconSize={8}
                  />

                  <IconButton
                    icon='/icons/deleteicon.svg'
                    altText='delete Icon'
                    onClick={handleDeleteCategory}
                    iconSize={8}
                  />
                </>
              ) : (
                <>
                  <SearchTextAdmin
                    placeholderText='Edit Category'
                    value={newEditCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                  <IconButton
                    icon='/icons/checkicon.svg'
                    altText='Check Icon'
                    onClick={handleEditCategory}
                    iconSize={8}
                  />
                </>
              )}
            </DashBoardButtonLayoutOption>
          </div>
          <div className='bg-blackgroundColor border border-greyColor/50 p-5 rounded-lg shadow-inner mt-6 flex flex-col'>
            <div className="flex flex-col mb-4 pb-2 border-b border-greyColor/20">
              <h4 className="text-sm font-bold text-primaryColor tracking-wide">
                SUBCATEGORIES
                {subCategory.length === 0 && (
                  <span className='text-secondary font-normal ml-2'> (No Subcategories Available)</span>
                )}
              </h4>
              <p className="text-secondary text-xs mt-1 text-opacity-80">Subcategories for {selectedCategory.categoryName}</p>
            </div>

            <div className="flex items-center gap-x-3 text-base">
              <SearchTextAdmin
                placeholderText='Search Sub Category'
                value={searchSubcategory}
                onChange={(e) => { setsearchSubcategory(e.target.value) }}
              />
              <IconButton
                icon='/icons/addicon.svg'
                altText='Add Icon'
                onClick={() => {
                  setselectSubCategory(null)
                  setisCreatingSubcategory(true)
                }}
                iconSize={8}
              />
            </div>


            {subCategory.length > 0 && (
              <ul className="list-none bg-secondary/5 border rounded-lg border-greyColor text-sm mt-4 max-h-40 overflow-y-auto divide-y divide-greyColor/50">
                {subCategory.map((subcat, index) => (
                  <DropDownText
                    key={subcat.subCategoryId}
                    onClick={() => setselectSubCategory(subcat)}
                    indexKey={subcat.subCategoryId}
                    listName={subcat.subCategoryName}
                  />
                ))}
              </ul>
            )}

            {selectedSubCategory && (
              <div className='flex flex-row justify-between items-center p-3 mt-4 mb-2 bg-secondary/10 border border-secondary/20 rounded-md'>
                <h3 className='text-xs font-semibold text-secondary'>
                  SELECTED: <span className='text-primaryColor text-sm font-bold'>{`${selectedSubCategory.subCategoryName}`}</span>
                </h3>
                <IconButton
                  icon='/icons/closeicon.svg'
                  altText='close Icon'
                  onClick={() => {
                    setselectSubCategory(null)
                  }}
                  iconSize={8}
                />
              </div>
            )}

            <DashBoardButtonLayoutOption>
              {!selectedSubCategory && (
                <>
                  {isCreatingSubcategory && (
                    <>
                      <SearchTextAdmin
                        placeholderText='ADD SUB CATEGORY'
                        value={newSubcategory}
                        onChange={(e) => setnewSubcategory(e.target.value)}
                      />
                      <IconButton
                        icon='/icons/checkicon.svg'
                        altText='check Icon'
                        onClick={handleAddSubCategegory}
                        iconSize={8}
                      />
                      <IconButton
                        icon='/icons/closeicon.svg'
                        altText='Close Icon'
                        onClick={() => {
                          setisCreatingSubcategory(false)
                          setnewSubcategory('')
                        }}
                        iconSize={8}
                      />
                    </>
                  )}
                </>
              )}
              {(selectedSubCategory && !isEditingSubCategory) && (
                <>
                  <IconButton
                    icon='/icons/editicon.svg'
                    altText='close Icon'
                    onClick={() => { setisEditingSubCategory(true) }}
                    iconSize={8}
                  />
                  <IconButton
                    icon='/icons/deleteicon.svg'
                    altText='delete Icon'
                    onClick={handleDeleteSubCategory}
                    iconSize={8}
                  />
                </>
              )}
              {(selectedSubCategory && isEditingSubCategory) && (
                <>
                  <SearchTextAdmin
                    placeholderText='EDIT SUB CATEGORY'
                    value={newEditingSubCategoryName}
                    onChange={(e) => setnewEditingSubCategoryName(e.target.value)}
                  />
                  <IconButton
                    icon='/icons/checkicon.svg'
                    altText='Edit Icon'
                    onClick={handleEditSubCategory}
                    iconSize={8}
                  />
                  <IconButton
                    icon='/icons/closeicon.svg'
                    altText='Edit Icon'
                    onClick={() => {
                      setisEditingSubCategory(false)
                      setnewEditingSubCategoryName('')
                    }}
                    iconSize={8}
                  />
                </>
              )}
            </DashBoardButtonLayoutOption>
          </div>
        </div>
      )}

      {isCreatingCategory && (
        <div className="mt-6 p-5 text-primaryColor bg-secondary/5 border border-primaryColor/20 rounded-lg shadow-sm">
          <h3 className="text-sm font-bold tracking-wide mb-4 pb-2 border-b border-greyColor/30">ADD NEW CATEGORY</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 rounded-md w-full outline-none border-primaryColor text-secondary"
            />
            <DashBoardButtonLayoutOption>
              <IconButton
                icon='/icons/addicon.svg'
                altText='Add Icon'
                onClick={handleAddCategory}
                iconSize={8}
              />

              <IconButton
                icon='/icons/closeicon.svg'
                altText='Close Icon'
                onClick={() => {
                  setIsCreatingCategory(false)
                  setNewCategory('')
                }}
                iconSize={8}
              />
            </DashBoardButtonLayoutOption>
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${statusType === 'success' ? 'bg-[#1a2e1d] border-green-500/30' : 'bg-[#2e1a1a] border-red-500/30'
              }`}
          >
            {statusType === 'success' ? (
              <svg className="w-6 h-6 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <div className="flex flex-col max-w-[300px]">
              <span className={`text-sm font-bold ${statusType === 'success' ? 'text-green-400' : 'text-red-400'} uppercase tracking-wider`}>
                {statusType === 'success' ? 'Success' : 'Error'}
              </span>
              <p className="text-white text-sm font-medium mt-0.5 leading-snug">{statusMessage}</p>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="ml-4 text-secondary hover:text-white transition-colors shrink-0"
              title="Close notification"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
