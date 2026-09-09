'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  AlertCircle,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

import { CategoryProps } from '@/types/categoryType';

import { addCategory, editCategory, deleteCategory, toggleCategoryStatus, reorderCategories } from '@/lib/api/categoryService';
import { SubCategoryProps, fetchSubCategoriesByCategory, addSubCategory, editSubCategory, deleteSubCategory, toggleSubCategoryStatus, reorderSubCategories } from '@/lib/api/subCategoryService';
import { SearchTextAdmin, IconButton, InputText, CustomPrimaryButton } from '@/components/ui';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  categorylist: CategoryProps[];
};

export const DashboardCategoryClient = ({ categorylist }: Props) => {
  const { data: session } = useSession();
  const token = session?.accessToken || '';
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
  const [editSubCategoryCategoryId, setEditSubCategoryCategoryId] = useState<number | null>(null);
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);

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
      const newCat = await addCategory({ category_name: newCategoryName }, token);
      if (newCat) {
        setCategories([...categories, { ...newCat, subcategoriesCount: 0, isActive: true, is_active: true }]);
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
      const updated = await editCategory(categoryId, { category_name: editCategoryName }, token);
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

  const handleToggleCategoryStatus = async (cat: CategoryProps) => {
    const currentActive = cat.isActive !== undefined ? cat.isActive : (cat.is_active !== undefined ? cat.is_active : true);
    const newStatus = !currentActive;

    // Optimistic UI update
    setCategories(categories.map(c => c.categoryId === cat.categoryId ? { ...c, isActive: newStatus, is_active: newStatus } : c));
    if (selectedCategory?.categoryId === cat.categoryId) {
      setSelectedCategory({ ...selectedCategory, isActive: newStatus, is_active: newStatus });
    }

    try {
      const res = await toggleCategoryStatus(cat.categoryId, newStatus, token);
      if (res) {
        showToast(`Category status set to ${newStatus ? 'Active' : 'Inactive'}`, 'success');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      // Revert optimistic update
      setCategories(categories.map(c => c.categoryId === cat.categoryId ? { ...c, isActive: currentActive, is_active: currentActive } : c));
      showToast('Failed to toggle category status', 'error');
    }
  };

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredCategories.length) return;

    const newFiltered = [...filteredCategories];
    const temp = newFiltered[index];
    newFiltered[index] = newFiltered[targetIndex];
    newFiltered[targetIndex] = temp;

    // Re-map full categories array maintaining non-filtered items
    const updatedCategories = [...categories];
    const itemA = filteredCategories[index];
    const itemB = filteredCategories[targetIndex];

    const posA = updatedCategories.findIndex(c => c.categoryId === itemA.categoryId);
    const posB = updatedCategories.findIndex(c => c.categoryId === itemB.categoryId);

    if (posA !== -1 && posB !== -1) {
      updatedCategories[posA] = itemB;
      updatedCategories[posB] = itemA;
    }

    setCategories(updatedCategories);

    const orderedIds = updatedCategories.map(c => c.categoryId);
    const ok = await reorderCategories(orderedIds, token);
    if (ok) {
      showToast('Category priority updated', 'success');
    } else {
      showToast('Failed to save category order', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    try {
      const success = await deleteCategory(categoryId, token);
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
      }, token);
      if (newSub) {
        setSubcategories([...subcategories, { ...newSub, isActive: true, is_active: true }]);
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
      const newParentId = editSubCategoryCategoryId ?? selectedCategory?.categoryId;
      const updated = await editSubCategory(subCategoryId, {
        sub_category_name: editSubCategoryName,
        category_id: newParentId
      }, token);

      if (updated) {
        // Check if parent category changed
        if (selectedCategory && newParentId && newParentId !== selectedCategory.categoryId) {
          // Remove subcategory from current list view
          setSubcategories(subcategories.filter(s => s.subCategoryId !== subCategoryId));
          // Update counters for both categories
          setCategories(categories.map(c => {
            if (c.categoryId === selectedCategory.categoryId) {
              return { ...c, subcategoriesCount: Math.max(0, (c.subcategoriesCount || 0) - 1) };
            }
            if (c.categoryId === newParentId) {
              return { ...c, subcategoriesCount: (c.subcategoriesCount || 0) + 1 };
            }
            return c;
          }));
          showToast('Subcategory reassigned to new parent category', 'success');
        } else {
          setSubcategories(subcategories.map(s => s.subCategoryId === subCategoryId ? { ...s, ...updated } : s));
          showToast('Subcategory updated successfully', 'success');
        }

        setEditingSubCategoryId(null);
        setEditSubCategoryCategoryId(null);
      }
    } catch (error) {
      showToast('Failed to update subcategory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubCategoryStatus = async (sub: SubCategoryProps) => {
    const currentActive = sub.isActive !== undefined ? sub.isActive : (sub.is_active !== undefined ? sub.is_active : true);
    const newStatus = !currentActive;

    // Optimistic UI update
    setSubcategories(subcategories.map(s => s.subCategoryId === sub.subCategoryId ? { ...s, isActive: newStatus, is_active: newStatus } : s));

    try {
      const res = await toggleSubCategoryStatus(sub.subCategoryId, newStatus, token);
      if (res) {
        showToast(`Subcategory status set to ${newStatus ? 'Active' : 'Inactive'}`, 'success');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      // Revert optimistic update
      setSubcategories(subcategories.map(s => s.subCategoryId === sub.subCategoryId ? { ...s, isActive: currentActive, is_active: currentActive } : s));
      showToast('Failed to toggle subcategory status', 'error');
    }
  };

  const handleMoveSubCategory = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= subcategories.length) return;

    const newSubs = [...subcategories];
    const temp = newSubs[index];
    newSubs[index] = newSubs[targetIndex];
    newSubs[targetIndex] = temp;

    setSubcategories(newSubs);

    const orderedIds = newSubs.map(s => s.subCategoryId);
    const ok = await reorderSubCategories(orderedIds, token);
    if (ok) {
      showToast('Subcategory priority updated', 'success');
    } else {
      showToast('Failed to save subcategory order', 'error');
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: number) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    setLoading(true);
    try {
      const success = await deleteSubCategory(subCategoryId, token);
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
      <div className={`${worksans.className} bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl shadow-sm p-6 flex flex-col space-y-4 h-[700px]`}>
        <div className="flex flex-row items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-primaryColor text-2xl font-bold">#</span>
            <h2 className="text-white text-xl font-bold tracking-tight">Categories</h2>
          </div>
          <CustomPrimaryButton
            isSelected
            onClick={() => {
              setIsCreatingCategory(true);
              setNewCategoryName('');
            }}
            className="py-2 px-2"
          >
            <span>+</span> Add New Category
          </CustomPrimaryButton>
        </div>
        <div className="flex items-center text-base w-full">
          <SearchTextAdmin
            placeholderText='Search Categories...'
            value={categorySearch}
            onChange={(e) => { setCategorySearch(e.target.value) }}
          />
        </div>

        <div className="flex flex-col mt-2 flex-1 overflow-hidden">
          <div className="flex justify-between px-4 py-2 border-b text-[#a6a7a6] border-greyColor/30 text-xs font-semibold uppercase tracking-wider">
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
            {filteredCategories.map((cat, index) => {
              const isCatActive = cat.isActive !== false && cat.is_active !== false;

              return (
                <li
                  key={cat.categoryId}
                  className={`flex justify-between px-4 py-4 items-center transition-colors group cursor-pointer ${!isCatActive ? 'opacity-60 bg-red-950/10' : ''} ${selectedCategory?.categoryId === cat.categoryId ? 'bg-white/10 border-l-2 border-primaryColor' : 'hover:bg-white/5'}`}
                  onClick={() => handleSelectCategory(cat)}
                >
                  <div className="flex flex-col gap-1 w-full pr-2">
                    {editingCategoryId === cat.categoryId ? (
                      <div className="flex gap-2 items-center w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="font-medium text-sm text-[#d9e3f4] bg-transparent border-b border-[#2c3542] focus:border-[#ffb77c]/50 outline-none w-full pb-1 transition-colors"
                          placeholder="Edit Category Name"
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
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${selectedCategory?.categoryId === cat.categoryId ? 'text-primaryColor' : 'text-white'}`}>{cat.categoryName.toUpperCase()}</span>
                          {!isCatActive && (
                            <span className="text-[10px] font-semibold text-red-400 border border-red-500/30 bg-red-950/40 px-1.5 py-0.2 rounded uppercase">Inactive</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[#a6a7a6] text-[10px] font-semibold uppercase">
                          <LinkIcon className="w-3 h-3 opacity-70" />
                          <span>Subcategories Attached: {cat.subcategoriesCount || 0}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {editingCategoryId !== cat.categoryId && (
                    <div className="flex items-center justify-end gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                      {/* Priority Up/Down */}
                      <div className="flex flex-col gap-0.5 mr-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveCategory(index, 'up')}
                          className="text-secondary hover:text-primaryColor disabled:opacity-20 p-0.5"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === filteredCategories.length - 1}
                          onClick={() => handleMoveCategory(index, 'down')}
                          className="text-secondary hover:text-primaryColor disabled:opacity-20 p-0.5"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Active Status Toggle */}
                      <button
                        className={`p-1 transition-colors ${isCatActive ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'}`}
                        onClick={(e) => { e.stopPropagation(); handleToggleCategoryStatus(cat); }}
                        title={isCatActive ? 'Deactivate Category' : 'Activate Category'}
                      >
                        {isCatActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-80" />}
                      </button>

                      {/* Edit */}
                      <button className="text-secondary hover:text-primaryColor p-1" onClick={(e) => { e.stopPropagation(); setEditCategoryName(cat.categoryName); setEditingCategoryId(cat.categoryId); }}>
                        <Pencil className="w-4 h-4 opacity-70" />
                      </button>
                      {/* Delete */}
                      <button className="text-secondary hover:text-red-400 p-1" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.categoryId); }}>
                        <Trash2 className="w-4 h-4 opacity-70" />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Subcategories Column */}
      <div className={`${worksans.className}  bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl shadow-sm p-6 flex flex-col space-y-4 h-[700px]`}>
        <div className="flex flex-row items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-primaryColor text-2xl font-bold">#</span>
            <h2 className="text-white text-xl font-bold tracking-tight">SubCategories</h2>
          </div>
          <CustomPrimaryButton
            isSelected={!!selectedCategory}
            onClick={() => {
              if (!selectedCategory) {
                showToast('Please select a category first', 'error');
                return;
              }
              setIsCreatingSubCategory(true);
              setNewSubCategoryName('');
            }}
            disabled={!selectedCategory}
            className={`py-2 px-4 ${!selectedCategory ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>+</span> Add Subcategory
          </CustomPrimaryButton>
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
          <div className="grid grid-cols-[2fr_2fr_1fr] px-4 py-2 border-b text-[#a6a7a6] border-greyColor/30 text-xs font-semibold uppercase tracking-wider">
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
            {selectedCategory && subcategories.map((sub, index) => {
              const isSubActive = sub.isActive !== false && sub.is_active !== false;

              return (
                <li key={sub.subCategoryId} className={`grid grid-cols-[2fr_2fr_1fr] px-4 py-4 items-center hover:bg-white/5 transition-colors group ${!isSubActive ? 'opacity-60 bg-red-950/10' : ''}`}>
                  {editingSubCategoryId === sub.subCategoryId ? (
                    <>
                      <div className="pr-2">
                        <input
                          type="text"
                          value={editSubCategoryName}
                          onChange={(e) => setEditSubCategoryName(e.target.value)}
                          className="font-medium text-sm text-[#d9e3f4] bg-transparent border-b border-[#2c3542] focus:border-[#ffb77c]/50 outline-none w-full pb-1 transition-colors"
                          placeholder="Edit SubCategory Name"
                        />
                      </div>
                      <div className="pr-2 relative">
                        {(() => {
                          const currentParentId = editSubCategoryCategoryId ?? selectedCategory.categoryId;
                          const currentParentCat = categories.find(c => c.categoryId === currentParentId) || selectedCategory;

                          return (
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setIsParentDropdownOpen(!isParentDropdownOpen)}
                                className="w-full flex items-center justify-between bg-[#16202c] border border-[#212b37] hover:border-[#ffb77c]/40 rounded-lg px-3 py-1.5 text-xs font-bold text-[#ffb77c] uppercase transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-[#ffb77c]/50"
                              >
                                <span className="truncate">{currentParentCat.categoryName.toUpperCase()}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-[#ffb77c] transition-transform duration-200 ml-1 shrink-0 ${isParentDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              {isParentDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1.5 z-[70] bg-[#121c28] border border-[#2c3542] rounded-xl shadow-2xl overflow-hidden py-1 max-h-48 overflow-y-auto custom-scrollbar ring-1 ring-white/10">
                                  {categories.map((c) => {
                                    const isSelected = c.categoryId === currentParentId;
                                    return (
                                      <button
                                        key={c.categoryId}
                                        type="button"
                                        onClick={() => {
                                          setEditSubCategoryCategoryId(c.categoryId);
                                          setIsParentDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-left transition-colors ${isSelected ? 'bg-[#ffb77c]/15 text-[#ffb77c]' : 'text-[#d9e3f4] hover:bg-[#16202c] hover:text-white'}`}
                                      >
                                        <span className="truncate">{c.categoryName.toUpperCase()}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-[#ffb77c] shrink-0 ml-1" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setIsParentDropdownOpen(false); handleUpdateSubCategory(sub.subCategoryId); }} className="text-green-400 p-1 hover:text-green-300">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setEditingSubCategoryId(null); setEditSubCategoryCategoryId(null); setIsParentDropdownOpen(false); }} className="text-red-400 p-1 hover:text-red-300">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm capitalize">{sub.subCategoryName}</span>
                        {!isSubActive && (
                          <span className="text-[10px] font-semibold text-red-400 border border-red-500/30 bg-red-950/40 px-1.5 py-0.2 rounded uppercase">Inactive</span>
                        )}
                      </div>
                      <div className="text-secondary text-sm capitalize">{selectedCategory.categoryName.toLowerCase()}</div>
                      <div className="flex items-center justify-end gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                        {/* Priority Up/Down */}
                        <div className="flex flex-col gap-0.5 mr-1">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveSubCategory(index, 'up')}
                            className="text-secondary hover:text-primaryColor disabled:opacity-20 p-0.5"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={index === subcategories.length - 1}
                            onClick={() => handleMoveSubCategory(index, 'down')}
                            className="text-secondary hover:text-primaryColor disabled:opacity-20 p-0.5"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Active Status Toggle */}
                        <button
                          className={`p-1 transition-colors ${isSubActive ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'}`}
                          onClick={() => handleToggleSubCategoryStatus(sub)}
                          title={isSubActive ? 'Deactivate Subcategory' : 'Activate Subcategory'}
                        >
                          {isSubActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-80" />}
                        </button>

                        {/* Edit */}
                        <button
                          className="text-secondary hover:text-primaryColor p-1"
                          onClick={() => {
                            setEditSubCategoryName(sub.subCategoryName);
                            setEditSubCategoryCategoryId(selectedCategory.categoryId);
                            setEditingSubCategoryId(sub.subCategoryId);
                          }}
                        >
                          <Pencil className="w-4 h-4 opacity-70" />
                        </button>

                        {/* Delete */}
                        <button className="text-secondary hover:text-red-400 p-1" onClick={() => handleDeleteSubCategory(sub.subCategoryId)}>
                          <Trash2 className="w-4 h-4 opacity-70" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
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
