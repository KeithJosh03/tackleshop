'use client';
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { BrandProps } from '@/types/dataprops';
import { worksans } from '@/types/fonts';
import Image from 'next/image';

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

export const DashboardBrandClient = ({brandslist} : Props) => {
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
      const uploadedImageUrl = await uploadImages([{file:brandState.imageUrl,originIndex:0}]);
      if (!uploadedImageUrl) throw new Error('No image URL returned.');
      const newBrand = await createBrand({
        brandName: brandState.brandName,
        imageUrl: uploadedImageUrl[0].url
      });
      setBrands(prev => [...prev, newBrand]);
      cancelAddBrand();
      setIsCreating(false);
    } catch (error) {
      console.error('Error in brand creation process:', error);
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

        console.log('✅ Brand updated successfully:', updatedBrand);
      }
    } catch (error) {
      console.error('❌ Error updating brand:', error);
    } finally {
      setLoading(false);
    }
  };


















  // Goood
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
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const cancelAddBrand = () => {
    dispatchCreateBrand({
    type:'CANCEL_BRAND_CREATE',
    payload:{
      brandName:'',
      imageUrl:null
    }
    })
    setIsCreating(false)
  }

  return (
    <div className={`${worksans.className}  bg-blackgroundColor border border-greyColor font-extrabold rounded p-4 w-full flex flex-col space-y-1`}>
      <h1 className="text-primaryColor text-xl">BRAND</h1>
      <div className="flex items-center gap-x-2 text-xl">
        <SearchTextAdmin 
        placeholderText='Search Brand'
        value={searchTerm}
        onChange={(e) => {setSearchTerm(e.target.value)}}
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
        <ul className="list-none bg-secondary border rounded border-primaryColor text-base max-h-40 overflow-y-auto">
          {filteredBrands.map((brand) => (
            <DropDownText 
            onClick={() => {
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
      <div className="mt-4 text-primaryColor border border-greyColor p-4 rounded">
        <div className='flex flex-row justify-between p-2'>
          <h3 className="text-base text-secondary">BRAND SELECTED - <span className='text-primaryColor'>{selectedBrand.brandName.toUpperCase()}</span></h3>
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
                {brandStateUpdate.imageUrl ? (
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
                    type:'BRAND_IMAGE_UPDATE',
                    payload:file
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
                type:'BRAND_NAME_UPDATE',
                payload:e.target.value
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
                  type:'CANCEL_BRAND_UPDATE',
                  payload:{
                    brandName:'',
                    imageUrl:null
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
        <div className="mt-4 p-4 text-primaryColor border border-greyColor">
          <div className='flex flex-row justify-between p-2'>
            <h3 className="text-lg">ADD NEW BRAND</h3>
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
                type:'BRAND_NAME_CREATE',
                payload:e.target.value
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
                  type:'BRAND_IMAGE_CREATE',
                  payload:file
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
    </div>
  );
};

