'use client';
import React, { useState, useEffect, useReducer } from 'react';
import { BrandProps } from '@/types/dataprops';
import { worksans } from '@/types/fonts';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import {
  DashBoardButtonLayoutOption,
  InputText,
  IconButton,
  SearchTextAdmin,
  ImageIconUpload,
  DropDownText
} from '@/components/'

import {
  useDashboardBrandCreateReducer,
  useDashboardBrandUpdateReducer
} from '@/hooks/useDashboardBrandReducer';

import { uploadImages } from '@/lib/api/uploadImage';
import { BrandHeaderProps } from '@/lib/api/brandService';
import { getChangedFieldsBrands } from '@/hooks/brandFieldsChange';

import {
  createBrand,
  deleteBrand,
  updateBrand
} from '@/lib/api/brandService';


type Props = {
  brandslist: BrandHeaderProps[];
};

export const DashboardBrandClient = ({ brandslist }: Props) => {
  const [brandState, dispatchCreateBrand] = useDashboardBrandCreateReducer()
  const [brandStateUpdate, dispatchUpdateBrand] = useDashboardBrandUpdateReducer();
  const [brands, setBrands] = useState<BrandProps[]>(brandslist);

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
      });
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
      // 2️⃣ build API payload (SEPARATE TYPE)
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
      const updatedBrand = await updateBrand(payload);

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











  // Good
  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;
    try {
      await deleteBrand({ brandId: selectedBrand.brandId });

      setBrands((prev) =>
        prev.filter(
          (brand) => brand.brandId !== selectedBrand.brandId
        )
      );
      setSelectedBrand(null);
      showToast('Brand deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting brand:', error);
      showToast('Failed to delete brand', 'error');
    }
  };

  const cancelAddBrand = () => {
    dispatchCreateBrand({
      type: 'CANCEL_BRAND_CREATE',
      payload: {
        brandName: '',
        imageUrl: null
      }
    })
    setIsCreating(false)
  }

  return (
    <div className={`${worksans.className} bg-blackgroundColor border border-greyColor rounded-xl shadow-sm p-6 w-full flex flex-col space-y-4`}>
      <div className="flex flex-col mb-2">
        <h2 className="text-primaryColor text-xl font-bold tracking-tight">BRANDS</h2>
        <p className="text-secondary text-xs mt-1 font-medium text-opacity-80">View, add, and manage brands.</p>
      </div>
      <div className="flex items-center gap-x-3 text-base">
        <SearchTextAdmin
          placeholderText='Search Brand'
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value) }}
        />
        <IconButton
          icon='/icons/addicon.svg'
          altText='Add Icon'
          onClick={() => {
            setIsCreating(true)
            setSelectedBrand(null)
          }}
          iconSize={8}
        />
      </div>

      {/* brandlist Render */}
      {filteredBrands.length > 0 && (
        <ul className="list-none bg-secondary/5 border rounded-lg border-greyColor text-sm mt-2 max-h-60 overflow-y-auto divide-y divide-greyColor/50 shadow-inner">
          {filteredBrands.map((brand) => (
            <DropDownText
              onClick={() => {
                dispatchUpdateBrand({
                  type: 'SET_BRAND_UPDATE',
                  payload: {
                    brandName: brand.brandName,
                    imageUrl: brand.imageUrl ?? null
                  }
                })
                handleSelectBrand(brand)
                setIsCreating(false)
                setSearchTerm('')
              }}
              key={brand.brandId}
              indexKey={brand.brandId}
              listName={brand.brandName}
            />
          ))}
        </ul>
      )}

      {/* Brand Choosen */}
      {selectedBrand && (
        <div className="mt-6 text-primaryColor bg-secondary/5 border border-primaryColor/20 p-5 rounded-lg shadow-sm">
          <div className='flex flex-row justify-between items-center mb-4 pb-2 border-b border-greyColor/30'>
            <h3 className="text-sm font-semibold text-secondary">BRAND SELECTED: <span className='text-primaryColor font-bold'>{selectedBrand.brandName.toUpperCase()}</span></h3>
            <IconButton
              icon='/icons/closeicon.svg'
              altText='Close Icon'
              onClick={() => {
                setSelectedBrand(null)
                seteditMode(false)
              }}
              iconSize={8}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-y-4">
            <div className='w-full items-center flex flex-col'>
              {!editMode ? (
                <div className='relative h-45 w-50 p-2 border brandsBackGround border-secondary hover:border-primaryColor rounded group flex flex-col items-center text-center justify-center justify-items-center'>
                  <Image
                    src={`${baseURL}${selectedBrand.imageUrl}`}
                    alt={selectedBrand.brandName}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="w-full flex flex-col items-center">
                    <div className='relative h-45 w-50 p-2 border brandsBackGround border-secondary hover:border-primaryColor rounded group flex flex-col items-center text-center justify-center justify-items-center'>
                      {brandStateUpdate.imageUrl instanceof File ? (
                        <Image
                          src={URL.createObjectURL(brandStateUpdate.imageUrl)}
                          alt="updateBrandImage"
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <Image
                          src={`${baseURL}${selectedBrand.imageUrl}`}
                          alt="currentBrandImage"
                          fill
                          className="object-contain"
                        />
                      )}
                      <ImageIconUpload
                        uploadImage='/icons/imageupload.svg'
                        maxImages={1}
                        onFileChange={(file: File) =>
                          dispatchUpdateBrand({
                            type: 'BRAND_IMAGE_UPDATE',
                            payload: file
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <DashBoardButtonLayoutOption>
              {!editMode && (
                <>
                  <IconButton
                    icon='/icons/editicon.svg'
                    altText='Edit Icon'
                    onClick={() => seteditMode(true)}
                    iconSize={8}
                  />
                  <IconButton
                    icon='/icons/deleteicon.svg'
                    altText='Delete Icon'
                    onClick={handleDeleteBrand}
                    iconSize={8}
                  />
                </>
              )}

              {editMode && (
                <>
                  <SearchTextAdmin
                    placeholderText="Edit Brand Name"
                    value={brandStateUpdate.brandName}
                    onChange={(e) => {
                      dispatchUpdateBrand({
                        type: 'BRAND_NAME_UPDATE',
                        payload: e.target.value
                      })
                    }}
                  />

                  <IconButton
                    icon='/icons/checkicon.svg'
                    altText='Add Icon'
                    onClick={handleUpdateBrand}
                    iconSize={8}
                  />

                  <IconButton
                    icon='/icons/closeicon.svg'
                    altText='Close Icon'
                    onClick={() => {
                      seteditMode(false)
                      dispatchUpdateBrand({
                        type: 'CANCEL_BRAND_UPDATE',
                        payload: {
                          brandName: '',
                          imageUrl: ''
                        }
                      })
                    }}
                    iconSize={8}
                  />
                </>
              )}

            </DashBoardButtonLayoutOption>
          </div>
        </div>
      )}


      {/* CREATE BRAND */}
      {isCreating && (
        <div className="mt-6 p-5 text-primaryColor bg-secondary/5 border border-primaryColor/20 rounded-lg shadow-sm">
          <div className='flex flex-row justify-between items-center mb-4 pb-2 border-b border-greyColor/30'>
            <h3 className="text-sm font-bold tracking-wide">ADD NEW BRAND</h3>
            <IconButton
              icon='/icons/closeicon.svg'
              altText='Close Icon'
              onClick={() => {
                cancelAddBrand()
              }}
              iconSize={8}
            />
          </div>
          <div className="space-y-4">
            <InputText
              placeholder="BRAND NAME"
              value={brandState.brandName ? brandState.brandName : ''}
              onChange={(e) => {
                dispatchCreateBrand({
                  type: 'BRAND_NAME_CREATE',
                  payload: e.target.value
                })
              }}
            />
            <div className="w-full flex flex-col items-center">
              <div className='relative h-45 w-50 p-2 border brandsBackGround border-secondary hover:border-primaryColor rounded group flex flex-col items-center text-center justify-center justify-items-center'>
                {!brandState.imageUrl && (
                  <ImageIconUpload
                    uploadImage='/icons/imageupload.svg'
                    maxImages={1}
                    onFileChange={(file: File) => {
                      dispatchCreateBrand({
                        type: 'BRAND_IMAGE_CREATE',
                        payload: file
                      })
                    }}
                  />
                )}
                {brandState.imageUrl ? (
                  <Image
                    src={URL.createObjectURL(brandState.imageUrl)}
                    alt="newbrandimage"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <h1 className='text-secondary group-hover:text-primaryColor'>No Selected Image</h1>
                )}
              </div>
            </div>
            <DashBoardButtonLayoutOption>
              <IconButton
                icon='/icons/addicon.svg'
                altText='Add Icon'
                onClick={handleAddBrand}
                iconSize={8}
              />

              <IconButton
                icon='/icons/closeicon.svg'
                altText='Delete Icon'
                onClick={() => {
                  cancelAddBrand()
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
};

