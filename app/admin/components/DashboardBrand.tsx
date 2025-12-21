'use client';
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { BrandProps } from '@/types/dataprops';
import { worksans } from '@/types/fonts';
import Image from 'next/image';

import DashBoardButtonLayoutOption from '@/components/DashBoardButtonLayoutOption';
import IconButton from '@/components/IconButton';
import SearchTextAdmin from '@/components/SearchTextAdmin';
import ImageIconUpload from '@/components/ImageIconUpload';
import DropDownText from '@/components/DropDownText';
import InputText from '@/components/InputText';
import { createBrand } from '@/lib/api/brandService';
import { uploadImages } from '@/lib/api/uploadImage';

type BrandActionType = 
 {type: 'BRAND_NAME' , payload:string} |
 {type: 'BRAND_IMAGE' , payload:File} |
 {type: 'CANCEL_BRAND', payload: BrandReduceProps} | 
 {type: 'ADD_BRAND', payload: BrandReduceProps} | 
 {type: 'DELETE_BRAND', payload: number}


interface BrandReduceProps {
  brandName:string;
  imageUrl: File | null;
}


function NewBrandReducer(
  state:BrandReduceProps, 
  action:BrandActionType)
  : BrandReduceProps {

    const {payload, type} = action 
    switch(type){
      case 'BRAND_NAME': 
        return {...state, brandName:payload}
      case 'BRAND_IMAGE':
        return {...state, imageUrl:payload}
      case 'CANCEL_BRAND': 
        return {...payload}
      default: 
      return state
    }
}


const DashboardBrand = () => {
    const initialBrandState: BrandReduceProps = {
      brandName:'',
      imageUrl:null
    }

  const [brandState, dispatchBrand] = useReducer(NewBrandReducer,initialBrandState) 

  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBrands, setFilteredBrands] = useState<BrandProps[]>([]);

  // Edit
  const [selectedBrand, setSelectedBrand] = useState<BrandProps | null>(null);
  const [editMode, seteditMode] = useState(false);
  const [editNameBrand, setEditNameBrand] = useState('');

  const [isCreating, setIsCreating] = useState(false);

  const [editBrandImage, seteditBrandImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';


  // Fetch brands from API
  useEffect(() => {
    axios.get<{ brands: BrandProps[] }>('/api/brands')
      .then((response) => {
        setBrands(response.data.brands);
      })
      .catch((error) => console.error('Error fetching brands:', error));
  }, []);

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

    if (!editNameBrand?.trim() || !editBrandImage || !selectedBrand?.brandId) {
      console.error('❌ Brand name, image URL, or selected brand ID is missing.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('type', 'brand');
    formData.append('imageUrl', editBrandImage);

    try {
      const uploadResponse = await axios.post('/api/imageupload/uploads/', formData);
      const data = uploadResponse?.data;

      if (data && data.image_paths) {
        const updatedBrandResponse = await axios.put(`/api/brands/${selectedBrand.brandId}`, {
          brand_name: editNameBrand,  
          image_url: data.image_paths[0],  
          brand_id: selectedBrand.brandId 
        });

        const updatedBrand = updatedBrandResponse.data;

        if (updatedBrand && updatedBrand.brandId) {
          console.log('✅ Brand updated successfully:', updatedBrand);
          setBrands((prevBrands) =>
            prevBrands.map((brand) =>
              brand.brandId === updatedBrand.brandId
                ? { ...brand, brandName: updatedBrand.brandName, imageUrl: updatedBrand.imageUrl }
                : brand
            )
          );

          setSelectedBrand(null)
          seteditBrandImage(null);
          setEditNameBrand('');
          seteditMode(false);
        } else {
          console.error('The updated brand data is invalid.');
        }
      } else {
        throw new Error('No image URL returned from upload response.');
      }
    } catch (error) {
      console.error('Error updating brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = () => {
    if (selectedBrand) {
      axios.delete(`/api/brands/${selectedBrand.brandId}`)
        .then(() => {
          setBrands((prev) =>
            prev.filter((brand) => brand.brandId !== selectedBrand.brandId)
          );
          setSelectedBrand(null);
        })
        .catch((error) => console.error('Error deleting brand:', error));
    }
  };

  const cancelAddBrand = () => {
    dispatchBrand({
    type:'CANCEL_BRAND',
    payload:initialBrandState
    })
    setIsCreating(false)
  }

  return (
    <div className={`${worksans.className}  bg-mainBackgroundColor border border-greyColor font-extrabold rounded p-4 w-full flex flex-col space-y-1`}>
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
              src={`${selectedBrand.imageUrl}`} 
              alt={selectedBrand.brandName} 
              fill
              className="object-contain" 
              />
            </div>
            ) : (
            <>
            <div className="w-full flex flex-col items-center">
              <div className='relative h-45 w-50 p-2 border brandsBackGround border-secondary hover:border-primaryColor rounded group flex flex-col items-center text-center justify-center justify-items-center'>
                {editBrandImage ? (
                  <Image 
                    src={URL.createObjectURL(editBrandImage)} 
                    alt="newbrandimage"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <>
                  <ImageIconUpload
                  uploadImage='/icons/imageupload.svg'
                  maxImages={1}
                  onFileChange={(file: File) => 
                    seteditBrandImage(file)
                  }
                  />
                  <h1>No Selected Image</h1>
                  </>
                )}
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
            value={editNameBrand}
            onChange={(e) => setEditNameBrand(e.target.value)}
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
            setEditNameBrand('')
            }}
            iconSize={8}
            />
            </>
            )}

          </DashBoardButtonLayoutOption>
        </div>
      </div>
      )}

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
                dispatchBrand({
                type:'BRAND_NAME',
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
                  dispatchBrand({
                  type:'BRAND_IMAGE',
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

export default DashboardBrand;
