'use client';
import Image from 'next/image';
import React, { useState, useEffect, useReducer } from 'react';
import { useSession } from 'next-auth/react';

import { Pencil, Trash2, CheckCircle2, AlertCircle, X, Plus, UploadCloud, Check } from 'lucide-react';
import { worksans } from '@/types/fonts';
import { AnimatePresence, motion } from 'framer-motion';

import { BrandProps } from '@/types/brandType';
import {
  SearchTextAdmin,
  InputText,
  FileDropImage,
  CustomPrimaryButton
} from '@/components/ui';

import {
  useDashboardBrandCreateReducer,
  useDashboardBrandUpdateReducer
} from '@/hooks/useDashboardBrandReducer';

import { uploadImages } from '@/lib/api/uploadImage';
import { getChangedFieldsBrands } from '@/hooks/brandFieldsChange';

import {
  createBrand,
  updateBrand,
  deleteBrand
} from '@/lib/api/brandService';


type Props = {
  brandslist: BrandProps[];
};

export const DashboardBrandClient = ({ brandslist }: Props) => {
  const [brandState, dispatchCreateBrand] = useDashboardBrandCreateReducer();
  const [brandStateUpdate, dispatchUpdateBrand] = useDashboardBrandUpdateReducer();
  const [brands, setBrands] = useState<BrandProps[]>(brandslist);
  const { data: session } = useSession();
  const token = session?.accessToken || '';

  const [selectedBrand, setSelectedBrand] = useState<BrandProps | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBrands, setFilteredBrands] = useState<BrandProps[]>([]);

  // Edit
  const [isCreating, setIsCreating] = useState(false);
  const [editMode, seteditMode] = useState(false);

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

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    setFilteredBrands(
      brands.filter((brand) =>
        brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, brands]);

  const handleSelectBrand = (brand: BrandProps) => {
    setSelectedBrand(brand);
    setSearchTerm(brand.brandName);
    setFilteredBrands([]);
  };

  const handleAddBrand = async () => {
    setLoading(true);

    if (!brandState.brandName?.trim() || !brandState.imageUrl) {
      console.error('❌ Brand name or image URL is missing.');
      setLoading(false);
      return;
    }

    try {
      const uploadedImageUrl = await uploadImages([{ file: brandState.imageUrl, originIndex: 0 }]);
      if (!uploadedImageUrl) throw new Error('No image URL returned.');
      const newBrand = await createBrand({
        brandName: brandState.brandName,
        imageUrl: uploadedImageUrl[0].url
      }, token);
      setBrands(prev => [...prev, newBrand]);
      cancelAddBrand();
      setIsCreating(false);
      showToast('Brand added successfully', 'success');
    } catch (error) {
      console.error('Error in brand creation process:', error);
      showToast('Failed to add brand', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBrand = async () => {
    setLoading(true);

    // basic validation
    if (!brandStateUpdate.brandName?.trim() || !selectedBrand?.brandId) {
      console.error('❌ Brand name or selected brand ID is missing.');
      setLoading(false);
      return;
    }

    // 1️⃣ get diff
    const changes = getChangedFieldsBrands({
      original: selectedBrand,
      updated: brandStateUpdate,
    });

    // nothing changed → stop
    if (Object.keys(changes).length === 0) {
      console.log('⚠️ No changes detected');
      setLoading(false);
      return;
    }

    try {
      // 2️⃣ build API payload
      const payload: {
        brandId: number;
        brandName?: string;
        imageUrl?: string;
      } = {
        brandId: selectedBrand.brandId,
      };

      // add name if changed
      if (changes.brandName) {
        payload.brandName = changes.brandName;
      }

      // 3️⃣ upload image ONLY if changed
      if (changes.imageUrl instanceof File) {
        const uploaded = await uploadImages([
          { file: changes.imageUrl, originIndex: 0 },
        ]);

        if (!uploaded || uploaded.length === 0) {
          throw new Error('❌ Image upload failed');
        }

        payload.imageUrl = uploaded[0].url;
      }

      // 4️⃣ update brand
      const updatedBrand = await updateBrand(payload, token);

      // 5️⃣ update local state
      if (updatedBrand?.brandId) {
        setBrands((prev) =>
          prev.map((brand) =>
            brand.brandId === updatedBrand.brandId
              ? { ...brand, ...updatedBrand }
              : brand
          )
        );

        // reset UI
        setSelectedBrand(null);
        dispatchUpdateBrand({
          type: 'CANCEL_BRAND_UPDATE',
          payload: { brandName: '', imageUrl: null },
        });
        seteditMode(false);

        showToast('Brand updated successfully', 'success');
      }
    } catch (error) {
      console.error('❌ Error updating brand:', error);
      showToast('Failed to update brand', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cancelAddBrand = () => {
    dispatchCreateBrand({
      type: 'CANCEL_BRAND_CREATE',
      payload: {
        brandName: '',
        imageUrl: null
      }
    });
    setIsCreating(false);
  };

  return (
    <div className={`${worksans.className} bg-ma-surface-container/50 border-2 border-greyColor/20 rounded-2xl shadow-sm p-6 w-full h-full flex flex-col space-y-4`}>
      <div className="flex flex-row items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-primaryColor text-2xl font-bold">#</span>
          <h2 className="text-white text-xl font-bold tracking-tight">Brands</h2>
        </div>
        <CustomPrimaryButton
          isSelected
          onClick={() => {
            setIsCreating(true);
            setSelectedBrand(null);
            setSearchTerm('');
          }}
          className="py-2 px-4"
        >
          <span>+</span> Add New Brand
        </CustomPrimaryButton>
      </div>

      {(!isCreating) && (
        <div className="flex items-center text-base w-full">
          <SearchTextAdmin
            placeholderText='Search Brands...'
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); }}
          />
        </div>
      )}

      {/* brandlist Render */}
      {filteredBrands.length > 0 && (
        <div className="flex flex-col mt-1 flex-1 overflow-hidden">
          <div className="grid grid-cols-[1fr_3fr_2fr] px-4 py-2 border-b border-greyColor/30 text-xs text-[#a6a7a6] font-semibold uppercase tracking-wider">
            <div>ID</div>
            <div>Brand Name</div>
            <div className="text-right">Actions</div>
          </div>
          <ul className="list-none flex-1 overflow-y-auto divide-y divide-greyColor/20 custom-scrollbar">
            {filteredBrands.map((brand) => (
              <li key={brand.brandId} className="grid grid-cols-[1fr_3fr_2fr] px-4 py-4 items-center hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => {
                dispatchUpdateBrand({
                  type: 'SET_BRAND_UPDATE',
                  payload: {
                    brandName: brand.brandName,
                    imageUrl: brand.imageUrl ?? null
                  }
                });
                handleSelectBrand(brand);
                setIsCreating(false);
                setSearchTerm('');
              }}>
                <div className="text-secondary text-sm">#{brand.brandId}</div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold text-sm">{brand.brandName.toUpperCase()}</span>
                  <span className="bg-[#212b37] text-[#a6a7a6] text-[10px] px-2 py-0.5 rounded w-fit font-semibold uppercase border border-[#303a47]">
                    Linked Products: {brand.linkedProducts ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button className="text-secondary hover:text-red-400 p-1" title="Edit Brand">
                    <Pencil className="w-4 h-4 opacity-70" />
                  </button>
                  <button className="text-secondary hover:text-red-400 p-1" disabled={true} title="Delete Brand">
                    <Trash2 className="w-4 h-4 opacity-70" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── SELECTED / EDIT BRAND CARD ── */}
      <AnimatePresence>
        {selectedBrand && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mt-4 bg-[#121c28] border-2 border-primaryColor/30 rounded-xl p-5 shadow-2xl flex flex-col space-y-4"
          >
            <div className="flex flex-row justify-between items-center pb-3 border-b border-greyColor/20">
              <div className="flex items-center gap-2">
                <span className="text-primaryColor font-bold text-xs uppercase tracking-wider">Brand Details</span>
                <span className="text-white font-extrabold text-sm uppercase">[{selectedBrand.brandName}]</span>
              </div>
              <button
                onClick={() => {
                  setSelectedBrand(null);
                  seteditMode(false);
                }}
                className="text-[#a6a7a6] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                title="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              {!editMode ? (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="w-full max-w-[220px] h-[160px] relative rounded-xl overflow-hidden border border-greyColor/30 bg-[#0a1420] flex items-center justify-center p-3 shadow-inner">
                    <Image
                      src={`${baseURL}${selectedBrand.imageUrl}`}
                      alt={selectedBrand.brandName}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <button
                    onClick={() => seteditMode(true)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primaryColor hover:text-primaryColor/80 px-4 py-2 rounded-lg bg-primaryColor/10 border border-primaryColor/20 hover:bg-primaryColor/20 transition-all cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" /> Edit Brand
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#a6a7a6] uppercase tracking-wider">Brand Name</label>
                    <InputText
                      placeholder="Enter Brand Name..."
                      value={brandStateUpdate.brandName}
                      onChange={(e) => {
                        dispatchUpdateBrand({
                          type: 'BRAND_NAME_UPDATE',
                          payload: e.target.value
                        });
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#a6a7a6] uppercase tracking-wider">Brand Logo</label>
                    <FileDropImage
                      maxImages={1}
                      onFileChange={(file: File | File[]) => {
                        if (file instanceof File) {
                          dispatchUpdateBrand({
                            type: 'BRAND_IMAGE_UPDATE',
                            payload: file
                          });
                        }
                      }}
                    >
                      {brandStateUpdate.imageUrl instanceof File ? (
                        <>
                          <Image
                            src={URL.createObjectURL(brandStateUpdate.imageUrl)}
                            alt="updateBrandImage"
                            fill
                            className="object-contain p-3"
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white text-xs font-bold px-3 py-1.5 border border-white/30 rounded-lg bg-black/50 shadow-sm">Replace Logo</span>
                          </div>
                        </>
                      ) : selectedBrand.imageUrl ? (
                        <>
                          <Image
                            src={`${baseURL}${selectedBrand.imageUrl}`}
                            alt="currentBrandImage"
                            fill
                            className="object-contain p-3"
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1.5 items-center justify-center backdrop-blur-sm">
                            <UploadCloud className="w-6 h-6 text-primaryColor opacity-90" />
                            <span className="text-white text-xs font-bold px-3 py-1 border border-white/30 rounded-lg bg-black/50 text-center">Click or Drag to Replace</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-primaryColor/70 group-hover:text-primaryColor p-4 text-center">
                          <UploadCloud className="w-8 h-8 mb-2 opacity-80" />
                          <span className="font-bold text-sm">Drag & Drop Image</span>
                          <span className="text-xs mt-1 text-[#a6a7a6]">or click to browse</span>
                        </div>
                      )}
                    </FileDropImage>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-greyColor/20">
                    <button
                      onClick={() => {
                        seteditMode(false);
                        dispatchUpdateBrand({
                          type: 'CANCEL_BRAND_UPDATE',
                          payload: { brandName: '', imageUrl: '' }
                        });
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#a6a7a6] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <CustomPrimaryButton
                      isSelected
                      onClick={handleUpdateBrand}
                      className="py-2 px-5 text-xs font-bold"
                    >
                      <Check className="w-4 h-4" /> Save Changes
                    </CustomPrimaryButton>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CREATE BRAND CARD ── */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mt-4 bg-[#121c28] border-2 border-primaryColor/40 rounded-xl p-5 shadow-2xl flex flex-col space-y-4"
          >
            <div className="flex flex-row justify-between items-center pb-3 border-b border-greyColor/20">
              <div className="flex items-center gap-2">
                <span className="text-primaryColor font-bold text-base">+</span>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Add New Brand</h3>
              </div>
              <button
                onClick={cancelAddBrand}
                className="text-[#a6a7a6] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#a6a7a6] uppercase tracking-wider">Brand Name <span className="text-primaryColor">*</span></label>
                <InputText
                  placeholder="e.g. SHIMANO, DAIWA, BEARKING..."
                  value={brandState.brandName ? brandState.brandName : ''}
                  onChange={(e) => {
                    dispatchCreateBrand({
                      type: 'BRAND_NAME_CREATE',
                      payload: e.target.value
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#a6a7a6] uppercase tracking-wider">Brand Logo Image</label>
                <FileDropImage
                  maxImages={1}
                  onFileChange={(file: File | File[]) => {
                    if (file instanceof File) {
                      dispatchCreateBrand({
                        type: 'BRAND_IMAGE_CREATE',
                        payload: file
                      });
                    }
                  }}
                  className="w-full h-44 border-2 border-dashed border-primaryColor/40 hover:border-primaryColor bg-[#0a1420] rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden relative group"
                >
                  {brandState.imageUrl ? (
                    <>
                      <Image
                        src={URL.createObjectURL(brandState.imageUrl)}
                        alt="newbrandimage"
                        fill
                        className="object-contain p-3"
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1.5 items-center justify-center backdrop-blur-sm">
                        <UploadCloud className="w-6 h-6 text-primaryColor opacity-90" />
                        <span className="text-white text-xs font-bold px-3 py-1 border border-white/30 rounded-lg bg-black/50">Replace Logo</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-primaryColor/70 group-hover:text-primaryColor p-4 text-center">
                      <UploadCloud className="w-8 h-8 mb-2 opacity-80 text-primaryColor" />
                      <span className="font-bold text-sm text-white">Drag & Drop Logo Image Here</span>
                      <span className="text-xs mt-1 text-[#a6a7a6]">or click to browse from computer</span>
                    </div>
                  )}
                </FileDropImage>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-greyColor/20">
                <button
                  type="button"
                  onClick={cancelAddBrand}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#a6a7a6] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <CustomPrimaryButton
                  isSelected
                  onClick={handleAddBrand}
                  className="py-2.5 px-6 text-xs font-bold"
                >
                  <Plus className="w-4 h-4" /> Save Brand
                </CustomPrimaryButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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