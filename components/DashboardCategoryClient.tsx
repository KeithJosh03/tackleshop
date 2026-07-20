'use client';
import React, { useState, useEffect } from 'react';
import { worksans } from '@/types/fonts';
import {
  Check,
  X,
  Link as LinkIcon,
  Pencil,
  Trash2,
  Filter,
  Inbox,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { CategoryProps, addCategory, editCategory, deleteCategory } from '@/lib/api/categoryService';
import { SubCategoryProps, fetchSubCategoriesByCategory, addSubCategory, editSubCategory, deleteSubCategory } from '@/lib/api/subCategoryService';
import { SearchTextAdmin, IconButton, InputText } from '@/components/ui';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  categorylist: CategoryProps[];
};

export const DashboardCategoryClient = ({ categorylist }: Props) => {
  const [categories, setCategories] = useState<CategoryProps[]>(categorylist);
  const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategoryProps[]>([]);

  // Category UI State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // SubCategory UI State
  const [isCreatingSubCategory, setIsCreatingSubCategory] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<number | null>(null);
  const [editSubCategoryName, setEditSubCategoryName] = useState('');

  const [loading, setLoading] = useState(false);

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

  const filteredCategories = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleSelectCategory = async (category: CategoryProps) => {
    setSelectedCategory(category);
    setIsCreatingSubCategory(false);
    setEditingSubCategoryId(null);
    setLoading(true);
    try {
      const subs = await fetchSubCategoriesByCategory(category.categoryId);
      setSubcategories(subs || []);
    } catch (error) {
      console.error('Failed to fetch subcategories', error);
      showToast('Failed to fetch subcategories', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Category Handlers ---
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      const newCat = await addCategory({ category_name: newCategoryName });
      if (newCat) {
        setCategories([...categories, { ...newCat, subcategoriesCount: 0 }]);
        setIsCreatingCategory(false);
        setNewCategoryName('');
        showToast('Category added successfully', 'success');
      } else {
        throw new Error('Failed to add');
      }
    } catch (error) {
      showToast('Failed to add category', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (categoryId: number) => {
    if (!editCategoryName.trim()) return;
    setLoading(true);
    try {
      const updated = await editCategory(categoryId, { category_name: editCategoryName });
      if (updated) {
        setCategories(categories.map(c => c.categoryId === categoryId ? { ...c, categoryName: updated.categoryName } : c));
        if (selectedCategory?.categoryId === categoryId) {
          setSelectedCategory({ ...selectedCategory, categoryName: updated.categoryName });
        }
        setEditingCategoryId(null);
        showToast('Category updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update category', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    try {
      const success = await deleteCategory(categoryId);
      if (success) {
        setCategories(categories.filter(c => c.categoryId !== categoryId));
        if (selectedCategory?.categoryId === categoryId) {
          setSelectedCategory(null);
          setSubcategories([]);
        }
        showToast('Category deleted successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to delete category', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- SubCategory Handlers ---
  const handleAddSubCategory = async () => {
    if (!selectedCategory || !newSubCategoryName.trim()) return;
    setLoading(true);
    try {
      const newSub = await addSubCategory({
        category_id: selectedCategory.categoryId,
        sub_category_name: newSubCategoryName
      });
      if (newSub) {
        setSubcategories([...subcategories, newSub]);
        setCategories(categories.map(c =>
          c.categoryId === selectedCategory.categoryId
            ? { ...c, subcategoriesCount: (c.subcategoriesCount || 0) + 1 }
            : c
        ));
        setIsCreatingSubCategory(false);
        setNewSubCategoryName('');
        showToast('Subcategory added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add subcategory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubCategory = async (subCategoryId: number) => {
    if (!editSubCategoryName.trim()) return;
    setLoading(true);
    try {
      const updated = await editSubCategory(subCategoryId, { sub_category_name: editSubCategoryName });
      if (updated) {
        setSubcategories(subcategories.map(s => s.subCategoryId === subCategoryId ? updated : s));
        setEditingSubCategoryId(null);
        showToast('Subcategory updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update subcategory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: number) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    setLoading(true);
    try {
      const success = await deleteSubCategory(subCategoryId);
      if (success) {
        setSubcategories(subcategories.filter(s => s.subCategoryId !== subCategoryId));
        if (selectedCategory) {
          setCategories(categories.map(c =>
            c.categoryId === selectedCategory.categoryId
              ? { ...c, subcategoriesCount: Math.max(0, (c.subcategoriesCount || 0) - 1) }
              : c
          ));
        }
        showToast('Subcategory deleted successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to delete subcategory', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start h-full">
      {/* Categories Column */}
      <div className={`${worksans.className} bg-[#0E1313] backdrop-blur-[20px] border border-greyColor rounded-2xl shadow-sm p-6 flex flex-col space-y-4 h-[700px]`}>
        <div className="flex flex-row items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-primaryColor text-2xl font-bold">#</span>
            <h2 className="text-white text-xl font-bold tracking-tight">Categories</h2>
          </div>
          <button
            onClick={() => {
              setIsCreatingCategory(true);
              setNewCategoryName('');
            }}
            className="bg-primaryColor/20 hover:bg-primaryColor/30 text-primaryColor border border-primaryColor/50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <span>+</span> Add New Category
          </button>
        </div>

        <div className="flex flex-col mt-4 flex-1 overflow-hidden">
          <div className="flex justify-between px-4 py-2 border-b border-greyColor/30 text-xs font-semibold text-secondary uppercase tracking-wider">
            <div>Category Name</div>
            <div className="text-right">Actions</div>
          </div>

          {isCreatingCategory && (
            <div className="px-4 py-4 border-b border-greyColor/20 bg-white/5 flex gap-2 items-center">
              <InputText
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button onClick={handleAddCategory} className="text-green-400 p-1 hover:text-green-300">
                <Check className="w-5 h-5" />
              </button>
              <button onClick={() => setIsCreatingCategory(false)} className="text-red-400 p-1 hover:text-red-300">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <ul className="list-none flex-1 overflow-y-auto divide-y divide-greyColor/20 custom-scrollbar pr-2">
            {filteredCategories.map((cat) => (
              <li
                key={cat.categoryId}
                className={`flex justify-between px-4 py-4 items-center transition-colors group cursor-pointer ${selectedCategory?.categoryId === cat.categoryId ? 'bg-white/10 border-l-2 border-primaryColor' : 'hover:bg-white/5'}`}
                onClick={() => handleSelectCategory(cat)}
              >
                <div className="flex flex-col gap-1 w-full">
                  {editingCategoryId === cat.categoryId ? (
                    <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                      <InputText
                        placeholder="Edit Category Name"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                      />
                      <button onClick={() => handleUpdateCategory(cat.categoryId)} className="text-green-400 p-1 hover:text-green-300">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingCategoryId(null)} className="text-red-400 p-1 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`font-bold text-sm ${selectedCategory?.categoryId === cat.categoryId ? 'text-primaryColor' : 'text-white'}`}>{cat.categoryName.toUpperCase()}</span>
                      <div className="flex items-center gap-1 text-secondary text-[10px] font-semibold uppercase">
                        <LinkIcon className="w-3 h-3 opacity-70" />
                        <span>Subcategories Attached: {cat.subcategoriesCount || 0}</span>
                      </div>
                    </>
                  )}
                </div>

                {editingCategoryId !== cat.categoryId && (
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="text-secondary hover:text-primaryColor p-1" onClick={(e) => { e.stopPropagation(); setEditCategoryName(cat.categoryName); setEditingCategoryId(cat.categoryId); }}>
                      <Pencil className="w-4 h-4 opacity-70" />
                    </button>
                    {/* Only allow deletion if no subcategories, or handle warning. Here we just allow it. */}
                    <button className="text-secondary hover:text-red-400 p-1" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.categoryId); }}>
                      <Trash2 className="w-4 h-4 opacity-70" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Subcategories Column */}
      <div className={`${worksans.className} bg-[#0E1313] backdrop-blur-[20px] border border-greyColor rounded-2xl shadow-sm p-6 flex flex-col space-y-4 h-[700px]`}>
        <div className="flex flex-row items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-primaryColor text-2xl font-bold">#</span>
            <h2 className="text-white text-xl font-bold tracking-tight">SubCategories</h2>
          </div>
          <button
            onClick={() => {
              if (!selectedCategory) {
                showToast('Please select a category first', 'error');
                return;
              }
              setIsCreatingSubCategory(true);
              setNewSubCategoryName('');
            }}
            disabled={!selectedCategory}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${selectedCategory ? 'bg-primaryColor/20 hover:bg-primaryColor/30 text-primaryColor border border-primaryColor/50' : 'bg-greyColor/20 text-greyColor cursor-not-allowed border border-transparent'}`}
          >
            <span>+</span> Add Subcategory
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary border-b border-greyColor/30 pb-4">
          <Filter className="w-4 h-4" />
          Filtering by Parent Category:
          {selectedCategory ? (
            <span className="text-primaryColor font-bold border border-primaryColor/30 bg-primaryColor/10 px-2 py-0.5 rounded text-xs ml-1">[{selectedCategory.categoryName.toUpperCase()}]</span>
          ) : (
            <span className="text-greyColor font-medium ml-1">None selected</span>
          )}
        </div>

        <div className="flex flex-col mt-2 flex-1 overflow-hidden">
          <div className="grid grid-cols-[2fr_2fr_1fr] px-4 py-2 border-b border-greyColor/30 text-xs font-semibold text-secondary uppercase tracking-wider">
            <div>Subcategory Name</div>
            <div>Parent Category</div>
            <div className="text-right">Actions</div>
          </div>

          {isCreatingSubCategory && selectedCategory && (
            <div className="px-4 py-4 border-b border-greyColor/20 bg-white/5 flex gap-2 items-center">
              <div className="flex-1">
                <InputText
                  placeholder="New Subcategory Name"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                />
              </div>
              <div className="text-secondary text-sm flex-1">{selectedCategory.categoryName}</div>
              <div className="flex items-center gap-1">
                <button onClick={handleAddSubCategory} className="text-green-400 p-1 hover:text-green-300">
                  <Check className="w-5 h-5" />
                </button>
                <button onClick={() => setIsCreatingSubCategory(false)} className="text-red-400 p-1 hover:text-red-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <ul className="list-none flex-1 overflow-y-auto divide-y divide-greyColor/20 custom-scrollbar pr-2">
            {!selectedCategory && (
              <div className="flex flex-col items-center justify-center h-full text-greyColor mt-10 space-y-2">
                <Inbox className="w-12 h-12 opacity-20" />
                <p>Select a category to view its subcategories</p>
              </div>
            )}
            {selectedCategory && subcategories.length === 0 && !isCreatingSubCategory && (
              <div className="flex flex-col items-center justify-center h-full text-greyColor mt-10">
                <p>No subcategories found for {selectedCategory.categoryName}</p>
              </div>
            )}
            {selectedCategory && subcategories.map((sub) => (
              <li key={sub.subCategoryId} className="grid grid-cols-[2fr_2fr_1fr] px-4 py-4 items-center hover:bg-white/5 transition-colors group">
                {editingSubCategoryId === sub.subCategoryId ? (
                  <div className="flex items-center col-span-2 pr-4 gap-2">
                    <InputText
                      placeholder="Edit Subcategory Name"
                      value={editSubCategoryName}
                      onChange={(e) => setEditSubCategoryName(e.target.value)}
                    />
                    <div className="flex gap-1">
                      <button onClick={() => handleUpdateSubCategory(sub.subCategoryId)} className="text-green-400 p-1 hover:text-green-300">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingSubCategoryId(null)} className="text-red-400 p-1 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-white font-bold text-sm capitalize">{sub.subCategoryName}</div>
                    <div className="text-secondary text-sm capitalize">{selectedCategory.categoryName.toLowerCase()}</div>
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button className="text-secondary hover:text-primaryColor p-1" onClick={() => { setEditSubCategoryName(sub.subCategoryName); setEditingSubCategoryId(sub.subCategoryId); }}>
                        <Pencil className="w-4 h-4 opacity-70" />
                      </button>
                      <button className="text-secondary hover:text-red-400 p-1" onClick={() => handleDeleteSubCategory(sub.subCategoryId)}>
                        <Trash2 className="w-4 h-4 opacity-70" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${statusType === 'success' ? 'bg-[#1a2e1d] border-green-500/30' : 'bg-[#2e1a1a] border-red-500/30'}`}
          >
            {statusType === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
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
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
