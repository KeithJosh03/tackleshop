'use client';
import Image from 'next/image';
import React, { useState, useEffect, useReducer } from 'react';

import { Pencil, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { BrandProps } from '@/types/dataprops';
import { worksans } from '@/types/fonts';
import { AnimatePresence, motion } from 'framer-motion';

import DashBoardButtonLayoutOption from './DashBoardButtonLayoutOption';

import {
  SearchTextAdmin,
  InputText,
  IconButton,
  ImageIconUpload,
  DropDownText
} from '@/components/ui';

import {
  useDashboardBrandCreateReducer,
  useDashboardBrandUpdateReducer
} from '@/hooks/useDashboardBrandReducer';

import { uploadImages } from '@/lib/api/uploadImage';
import { BrandHeaderProps } from '@/lib/api/brandService';
import { getChangedFieldsBrands } from '@/hooks/brandFieldsChange';

import {
  createBrand,
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
    <div className={`${worksans.className} bg-[#0E1313] backdrop-blur-[20px] border border-greyColor rounded-2xl shadow-sm p-6 w-full h-full flex flex-col space-y-4`}>
      <div className="flex flex-row items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-primaryColor text-2xl font-bold">#</span>
          <h2 className="text-white text-xl font-bold tracking-tight">Brands</h2>
        </div>
        <button
          onClick={() => {
            setIsCreating(true)
            setSelectedBrand(null)
          }}
          className="bg-primaryColor/20 hover:bg-primaryColor/30 text-primaryColor border border-primaryColor/50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <span>+</span> Add New Brand
        </button>
      </div>
      <div className="flex items-center text-base w-full">
        <SearchTextAdmin
          placeholderText='Search Brands...'
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value) }}
        />
      </div>

      {/* brandlist Render */}
      {filteredBrands.length > 0 && (
        <div className="flex flex-col mt-4 flex-1 overflow-hidden">
          <div className="grid grid-cols-[1fr_3fr_2fr] px-4 py-2 border-b border-greyColor/30 text-xs font-semibold text-secondary uppercase tracking-wider">
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
                })
                handleSelectBrand(brand)
                setIsCreating(false)
                setSearchTerm('')
              }}>
                <div className="text-secondary text-sm">#{brand.brandId}</div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold text-sm">{brand.brandName.toUpperCase()}</span>
                  <span className="bg-[#835d32]/20 text-[#E89347] text-[10px] px-2 py-0.5 rounded-full w-fit font-semibold uppercase border border-[#E89347]/20">


                    Linked Products: 0
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button className="text-secondary hover:text-red-400 p-1"
                    // onClick={(e) => { e.stopPropagation(); handleEditCategory(brand.brandId); }}e
                    title="Edit Brand"
                  >
                    <Pencil className="w-4 h-4 opacity-70" />
                  </button>
                  {/* Only allow deletion if no subcategories, or handle warning. Here we just allow it. */}
                  <button className="text-secondary hover:text-red-400 p-1"
                    // onClick={(e) => { e.stopPropagation(); handleDeleteBrand(brand.brandId); }}
                    disabled={true}
                    title="Delete Brand"
                  >
                    <Trash2 className="w-4 h-4 opacity-70" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
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

