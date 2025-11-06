'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrandProps } from '@/types/dataprops';
import { worksans } from '@/types/fonts';
import Image from 'next/image';

import DashBoardButtonLayoutOption from '@/components/DashBoardButtonLayoutOption';
import IconButton from '@/components/IconButton';
import SearchTextAdmin from '@/components/SearchTextAdmin';
import ImageIconUpload from '@/components/ImageIconUpload';
import DropDownText from '@/components/DropDownText';

const DashboardBrand: React.FC = () => {
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBrands, setFilteredBrands] = useState<BrandProps[]>([]);

  // Edit
  const [selectedBrand, setSelectedBrand] = useState<BrandProps | null>(null);
  const [editMode, seteditMode] = useState(false);
  const [editNameBrand, setEditNameBrand] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandImage, setNewBrandImage] = useState<File | null>(null);
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

  const handleAddBrand = () => {
    setLoading(true);

    if (!newBrandName.length || !newBrandImage) {
      console.error("Brand name or image is missing.");
      return;
    }

    const formData = new FormData();
    formData.append('brand_name', newBrandName);
    formData.append('image_url', newBrandImage);
  
    axios.post('/api/brands', formData)
    .then((response) => {
      setLoading(false);
      const { brandId, brandName, imageUrl } = response.data;
      
      setBrands((prev) => [...prev, { brandId, brandName, imageUrl }]);
      setNewBrandName('');
      setNewBrandImage(null); 
      setIsCreating(false);
    })
    .catch((error) => {
      setLoading(false);
      console.error('Error adding brand:', error);
    });
  };

  const handleUpdateBrand = async () => {
    if (!editNameBrand.length || !editBrandImage || !selectedBrand?.brandId) {
        console.error("Brand name, image, or selected brand ID is missing.");
        return;
    }
    const formData = new FormData();
    formData.append('brand_name', editNameBrand);
    formData.append('image_url', editBrandImage);
    formData.append('_method', 'PUT'); 
    try {
        const response = await axios.post(`/api/brands/${selectedBrand.brandId}`, formData);
        if (response.status === 200 || response.status === 201) {
          const updateBrand = response.data;
          if (updateBrand && updateBrand.brandId) {
            setBrands((prevBrands) =>
              prevBrands.map((brand) =>
                brand.brandId === updateBrand.brandId
                  ? { ...brand, brandName: updateBrand.brandName, imageUrl: updateBrand.imageUrl }
                  : brand
              )
            )
            seteditBrandImage(null)
            setEditNameBrand('')
            seteditMode(false)
          } else {
            console.error("The updated category data is invalid.");
          }
      }
    } catch (err) {
        console.error(`Error updating brand: ${err}`);
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


  return (
    <div className={`${worksans.className} border border-greyColor font-extrabold rounded p-4 w-full flex flex-col space-y-1`}>
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
        text='ADD'
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
            text='CANCEL'
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
              <div className='relative h-28 w-52 brandsBackGround rounded'>
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
                <div className='relative h-28 w-52 brandsBackGround rounded items-center text-center justify-center justify-items-center'>
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
                    onFileChange={(file) => seteditBrandImage(file)}
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
                text='EDIT'
                onClick={() => seteditMode(true)}
                iconSize={8}
              />
              <IconButton 
                icon='/icons/deleteicon.svg'
                altText='Delete Icon'
                text='Delete'
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
              text='ADD'
              onClick={handleUpdateBrand}
              iconSize={8}
              />

              <IconButton 
              icon='/icons/closeicon.svg'
              altText='Close Icon'
              text='Cancel'
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
            text='CANCEL'
            onClick={() => setIsCreating(false)}
            iconSize={8}
            />
          </div>

          <div className="space-y-4">
            <SearchTextAdmin 
            placeholderText="Brand Name"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            />
            <div className="w-full flex flex-col items-center">
              <ImageIconUpload
              uploadImage='/icons/imageupload.svg'
              onFileChange={(file) => setNewBrandImage(file)}
              />
              <div className='relative h-28 w-52 brandsBackGround rounded items-center text-center justify-center'>
                {newBrandImage ? (
                  <Image 
                    src={URL.createObjectURL(newBrandImage)} 
                    alt="newbrandimage"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <h1>No Selected Image</h1>
                )}
              </div>
            </div>
            <DashBoardButtonLayoutOption>
              <IconButton 
              icon='/icons/addicon.svg'
              altText='Add Icon'
              text='ADD'
              onClick={handleAddBrand}
              iconSize={8}
              />

              <IconButton 
              icon='/icons/closeicon.svg'
              altText='Delete Icon'
              text='DELETE'
              onClick={() => {
              setIsCreating(false)
              setNewBrandName('')
              setNewBrandImage(null)
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
