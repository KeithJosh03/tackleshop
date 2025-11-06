'use client';
import { usePathname } from 'next/navigation'; 

import InputText from '@/components/InputText';
import DropDownText from '@/components/DropDownText';
import TextBox from '@/components/TextBox';
import CustomButton from '@/components/CustomButton';
import InputPrice from '@/components/InputPrice';
import IconButton from '@/components/IconButton';
import Image from 'next/image';
import ImageIconUpload from '@/components/ImageIconUpload';
import { useState, useEffect, useReducer, Fragment } from 'react';
import axios from 'axios';

import { 
  CategoryProps,
  SubCategoryProps,
  BrandProps,
  CategorySubProps,
} from '@/types/dataprops';
import { form } from 'framer-motion/client';

type Discount = 
  null | 'Percentage' | 'Unit'

interface ProductDiscount {
  discountType: Discount | null;
  discountValue: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface ProductImage {
  url: File;
  isMain: boolean;
}


interface ProductDetailVariant {
  variantName:string;
  variantPrice:string;
  discount:ProductDiscount | null;
  variantImages: ProductImage [];
}

interface ProductDetails {
  productName: string;
  basePrice: string;
  description: string | null;
  features: string | null;
  specifications: string | null;
  brand: BrandProps | null;
  category: CategoryProps | null;
  subCategory: SubCategoryProps | null;
  variantProducts: ProductDetailVariant[];
}


type ProductDetailActions = 
  { type: 'UPDATE_PRODUCT_NAME'; payload: string } |
  { type: 'UPDATE_BASE_PRICE'; payload: string } |
  { type: 'UPDATE_DESCRIPTION'; payload: string | null} |
  { type: 'UPDATE_FEATURES'; payload: string | null} |
  { type: 'UPDATE_SPECIFICATIONS'; payload: string | null} |
  { type: 'SELECT_BRAND'; payload: BrandProps | null} |
  { type: 'SELECT_CATEGORY'; payload: CategoryProps | null} |
  { type: 'SELECT_SUBCATEGORY'; payload: SubCategoryProps | null} |
  { type: 'ADD_VARIANT'; payload: ProductDetailVariant} |
  { type: 'ADD_PRODUCT'; payload: boolean} |
  { type: 'REMOVE_VARIANT'; payload: number}


type ProductVariantActions = 
  { type: 'UPDATE_VARIANT_NAME'; payload: string} |
  { type: 'UPDATE_VARIANT_PRICE'; payload: string} |
  { type: 'UPDATE_DISCOUNT_TYPE'; payload: Discount} |
  { type: 'UPDATE_DISCOUNT_VALUE'; payload: string} | 
  { type: 'ADD_VARIANT_IMAGES'; payload: ProductImage} |
  { type: 'CLEAN_STATE'; payload: ProductDetailVariant} |
  { type: 'REMOVE_IMAGE'; payload: number}  |
  { type: 'UPDATE_START_DATE'; payload: Date }|
  { type: 'UPDATE_END_DATE'; payload: Date } 





function productDetailReducer(
state: ProductDetails, 
action: ProductDetailActions
): ProductDetails {
  const { type, payload } = action;

  switch (type) {
    case "UPDATE_PRODUCT_NAME":
      return { ...state, productName: payload };
    case "UPDATE_BASE_PRICE":
      return { ...state, basePrice: payload };
    case "UPDATE_DESCRIPTION" :
      return { ...state, description: payload};
    case "UPDATE_FEATURES" :
      return { ...state, features: payload};
    case "UPDATE_SPECIFICATIONS" :
      return { ...state, specifications: payload};
    case "SELECT_BRAND" : 
      return {...state, brand: payload}
    case "SELECT_CATEGORY" : 
      return {...state, category: payload}
    case "SELECT_SUBCATEGORY" : 
      return {...state, subCategory: payload}
    case "ADD_VARIANT":
      return {
        ...state,
        variantProducts: [...state.variantProducts, payload] 
      };
    case 'ADD_PRODUCT': 
      console.log(state.variantProducts);
      if(payload){
        const formData = new FormData();

        formData.append('category_id', state.category ? state.category.categoryId.toString() : '');
        formData.append('sub_category_id', state.subCategory ? state.subCategory.subCategoryId.toString() : '');
        formData.append('brand_id', state.brand ? state.brand.brandId.toString() : '');
        formData.append('product_name', state.productName);
        formData.append('base_price', (parseFloat(state.basePrice || '0') || 0).toString());
        formData.append('description', state.description || '');
        formData.append('specifications', state.specifications || '');
        formData.append('features', state.features || '');

        if (state.variantProducts && state.variantProducts.length > 0) {
          state.variantProducts.map((variant,index) => {
            formData.append(`variants[${index}].variant_name`,variant.variantName)
            formData.append(`variants[${index}].variant_price`,variant.variantPrice)
            if(variant.discount){
              formData.append(`variants[${index}].discount.discountType`,variant.discount.discountType || '')
              formData.append(`variants[${index}].discount.discountValue`,variant.discount.discountValue || '')
            }

            if(variant.variantImages){
              variant.variantImages.map((images,indexImg) => {
              formData.append(`variants[${index}].variantImage[${images}].url`,images.url)
              formData.append(`variants[${index}].variantImage[${images}].isMain`, String(images.isMain || ''))
              })
            }
          });
        }
        
        for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        // axios.post('/api/products', formData)
        //   .then((response) => {
        //     console.log(response.data);
        //   })
        //   .catch((error) => console.error('Error fetching brands:', error));
      }

    case 'REMOVE_VARIANT':
      return {
        ...state,
        variantProducts: state.variantProducts.filter((_, index) => index !== action.payload),
      };
  
    default:
      return state;
  }
}

function productVariantReducer(
  state: ProductDetailVariant, 
  action: ProductVariantActions
): ProductDetailVariant {
  const { type, payload } = action;
  
  switch (type){
    case 'UPDATE_VARIANT_NAME' :
      return {...state, variantName:payload}
    case 'UPDATE_VARIANT_PRICE' : 
      return {...state, variantPrice:payload}
    case 'UPDATE_DISCOUNT_TYPE' :
      if (payload === null) {
        return {...state, discount: null}
      }
      return {
        ...state, 
        discount: state.discount ? 
        { ...state.discount, discountType: payload } 
        : 
        { discountType: payload, discountValue: '', startDate: new Date, endDate: new Date }
      };
    case 'UPDATE_DISCOUNT_VALUE' : 
      return {...state, 
        discount:state.discount ? { ...state.discount, discountValue: payload} : null
      }
    case 'ADD_VARIANT_IMAGES': 
      return {
      ...state,
      variantImages: state.variantImages
      ? [...state.variantImages, action.payload]
      : [action.payload]
      }

    case 'CLEAN_STATE':
      return {
      ...payload,
      }
    case 'REMOVE_IMAGE':
      return {
        ...state,
        variantImages: state.variantImages.filter((_, index) => index !== action.payload),
      };
    case 'UPDATE_START_DATE':
      return {
        ...state,
        discount: state.discount
          ? {
              ...state.discount,
              startDate: payload || new Date(),
              discountValue: state.discount.discountType ? state.discount.discountValue : ''
            }
          : {
              startDate: payload || new Date(),
              endDate: new Date(),
              discountType: null,
              discountValue: ''
            }
      };
    case 'UPDATE_END_DATE' :
      return {
        ...state,
        discount: state.discount
          ? {
              ...state.discount,
              endDate: payload || new Date(),
              discountValue: state.discount.discountType ? state.discount.discountValue : ''
            }
          : {
              startDate: new Date(),
              endDate: payload || new Date(),
              discountType: null,
              discountValue: ''
            }
      };
    default: 
      return state;
  }
}





export default function page() {
  const pathname = usePathname(); 
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [subCategories, setsubCategories] = useState<SubCategoryProps[]>([]);

  const initialProductState = {
    productName: '',
    basePrice:'',
    description: null,
    features:null,
    specifications:null,
    brand: null,
    category:null,
    subCategory:null,
    variantProducts:[]
  };

  const inititalProductVariantState = {
    variantName:'',
    variantPrice:'',
    discount: null,
    variantImages: []
  }

  const [ProductDetailState, dispatch] = useReducer(productDetailReducer,initialProductState) 
  const [ProductVariantState, dispatchProductVariant] = useReducer(productVariantReducer,inititalProductVariantState)

  const [isOpenBrand, setIsOpenBrand] = useState<boolean>(false);
  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);
  const [isOpenSubCategory, setIsOpenSubCategory] = useState<boolean>(false);
  const [isOpenDescription, setIsOpenDescription] = useState<boolean>(false)
  const [isOpenSpecification, setIsOpenSpecification] = useState<boolean>(false)
  const [isOpenFeature, setIsOpenFeature] = useState<boolean>(false);
  const [isAddingVariant, setisAddingVariant] = useState<boolean>(false);

  interface CategorySubResponse {
    status: boolean;
    categorySub: CategorySubProps;
  }


  useEffect(() => {
    if(pathname !== '/admin/dashboard/products/addproduct') return;

    axios.get<{ brands: BrandProps[] }>('/api/brands')
      .then((response) => {
        setBrands(response.data.brands);
      })
      .catch((error) => console.error('Error fetching brands:', error));

    axios.get<{categories: CategoryProps[]}>('/api/categories/')
    .then((response) => {
      setCategories(response.data.categories);
    })
    .catch((error) => console.error('Error fetching Categories:', error));

  },[])


  useEffect(() => {
    if (ProductDetailState?.category === null) return;

    axios.get<CategorySubResponse>(`/api/categories/categorysub/${ProductDetailState.category.categoryId}/`)
      .then((response) => {
        setsubCategories(response.data.categorySub.subCategories);
      })
      .catch((error) => console.error('Error fetching Sub Categories:', error));

  }, [ProductDetailState?.category?.categoryId]);


  const addVariant = () => {
    console.log(ProductVariantState);

    let validation = () => {
      if (!ProductVariantState.variantName.trim() || !ProductVariantState.variantPrice.trim()) {
        return false; 
      }
      if (ProductVariantState.discount !== null) {
        const { discountType, discountValue, startDate, endDate } = ProductVariantState.discount;
        if (!discountType || !discountValue || !startDate || !endDate) {
          return false;
        }
        if (Object.prototype.toString.call(startDate) !== '[object Date]' || isNaN(startDate.getTime())) {
          return false; 
        }

        if (Object.prototype.toString.call(endDate) !== '[object Date]' || isNaN(endDate.getTime())) {
          return false;
        }

        if (endDate < startDate) {
          return false;
        }
      }
      if (Array.isArray(ProductVariantState.variantImages) && ProductVariantState.variantImages.length > 0) {
        console.log(ProductVariantState.variantImages);
        const hasMainImage = ProductVariantState.variantImages.some((variant) => variant.isMain === true);
          if (!hasMainImage) {
            return false;
          }
      }
      return true; 
    };
    if (validation()) {
      dispatch({
        type: 'ADD_VARIANT',
        payload: ProductVariantState
      });
      dispatchProductVariant({
        type: 'CLEAN_STATE',
        payload: inititalProductVariantState
      });
      setisAddingVariant(false);
      console.log(ProductDetailState);
    }
  };


  const addProduct = () => {
    let validationProduct = () => {
      if(!ProductDetailState.productName.trim() || !ProductDetailState.basePrice.trim()){
        return false;
      } 

      if(!ProductDetailState.brand || !ProductDetailState.category || !ProductDetailState.subCategory){
        return false;
      }

      if (Array.isArray(ProductDetailState.variantProducts) && ProductDetailState.variantProducts.length > 0) {
        const foundVariantandImage = ProductDetailState.variantProducts
          .find((variantProduct) => 
            Array.isArray(variantProduct.variantImages) && 
            variantProduct.variantImages.some((variantImage) => variantImage.isMain === true)
          );
        if (foundVariantandImage) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    if(validationProduct()){
      dispatch({
      type:'ADD_PRODUCT',
      payload: true
      })
    }
  }



  const getThumbNail = () => {
    const mainImage = ProductVariantState.variantImages
      .find((variantImage) => variantImage.isMain === true);

    return mainImage ? mainImage : null;
  }

  return (
    <div className='grid grid-cols-6 gap-2'>
      <div className='col-span-3 flex flex-col gap-y-2'>
        <div className='flex flex-col border border-greyColor p-2 gap-y-2 font-extrabold rounded'>
          <div className='flex flex-row justify-between items-center justify-items-center p-2'>
            <h3 className="text-2xl text-primaryColor font-extrabold">
            PRODUCT DETAILS
            </h3>
            <CustomButton 
            text='SAVE PRODUCT'
            onClick={() => {
            addProduct()
            }}
            />
          </div>
          <div className='flex flex-row'>
            <div className='flex-1 flex flex-col gap-y-2 p-2'>
              <h1 className='text-primaryColor text-lg'>PRODUCT NAME</h1>
              <InputText
              placeholder="Product Name"
              value={ProductDetailState.productName}
              onChange={(e) => {
                dispatch({
                type:"UPDATE_PRODUCT_NAME",
                payload:e.target.value
                });
              }}
              />
              <p className='text-sm text-secondary'>A product name is required</p>
            </div>
            <div className='flex-1 flex flex-col gap-y-2 p-2'>
              <h1 className='text-primaryColor text-lg'>BASE PRICE</h1>
              <InputPrice
              isUnit={true}
              placeholder="Base Price"
              value={`${ProductDetailState.basePrice}`}
              onChange={(e) => {
                dispatch({
                type:"UPDATE_BASE_PRICE",
                payload:e.target.value
                });
              }}
              />
              <p className='text-sm text-secondary'>A base price is required</p>
            </div>
          </div>

          <div className='flex flex-col'>
            <TextBox 
            onClick={() => {setIsOpenDescription(!isOpenDescription)}}
            categoryLength={ProductDetailState.description ? ProductDetailState.description.length : 0}
            textBoxCategory='DESCRIPTION'
            isOpenBox={isOpenDescription}
            textBoxValue={ProductDetailState.description || ''}
            onChange={(e) => {
              dispatch({
              type:"UPDATE_DESCRIPTION",
              payload:e.target.value
              });
            }}
            />
            <TextBox 
            onClick={() => {setIsOpenSpecification(!isOpenSpecification)}}
            categoryLength={ProductDetailState.specifications ? ProductDetailState.specifications.length : 0}
            textBoxCategory='SPECIFICATIONS'
            isOpenBox={isOpenSpecification}
            textBoxValue={ProductDetailState.specifications || ''}
            onChange={(e) => {
              dispatch({
              type:"UPDATE_SPECIFICATIONS",
              payload:e.target.value
              });
            }}
            />
            <TextBox 
            onClick={() => {setIsOpenFeature(!isOpenFeature)}}
            categoryLength={ProductDetailState.features ? ProductDetailState.features.length : 0}
            textBoxCategory='FEATURES'
            isOpenBox={isOpenFeature}
            textBoxValue={ProductDetailState.features || ''}
            onChange={(e) => {
              dispatch({
              type: "UPDATE_FEATURES",
              payload:e.target.value
              })
            }}
            />
          </div>
        </div>
        <div className='flex flex-col p-2 gap-x-2 font-extrabold rounded border border-greyColor'>
            <div className='flex flex-row justify-between items-center p-2'>
              <h3 className="text-2xl text-primaryColor font-extrabold">
              BRAND & CATEGORIES
              </h3>
            </div>

            <div className='flex flex-row'>
              <div className="flex-1 flex flex-col gap-y-2 p-2">
                <h1 className='text-primaryColor'>BRAND</h1>
                <div className="relative">
                  <button
                    className="border p-2 w-full text-left border-primaryColor rounded text-base font-extrabold text-primaryColor"
                    onClick={() => {setIsOpenBrand(!isOpenBrand)}}
                  >
                    {ProductDetailState.brand ? ProductDetailState.brand.brandName : 'Select Brand'}
                  </button>
                  {isOpenBrand && (
                    <div className="absolute w-full bg-primaryColor border rounded shadow-lg z-10">
                      <ul className="list-none bg-secondary border rounded border-primaryColor text-base max-h-40 overflow-y-auto">
                        {brands.map((brand) => (
                          <DropDownText 
                          key={brand.brandId}
                          listName={brand.brandName}
                          indexKey={brand.brandId}
                          onClick={() => {
                            dispatch({
                            type:"SELECT_BRAND",
                            payload:{
                                brandId: brand.brandId,
                                brandName: brand.brandName,
                              }
                            })
                            setIsOpenBrand(false);
                          }}
                          />
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-y-2 p-2">
                <h1 className='text-primaryColor'>CATEGORY</h1>
                <div className="relative">
                  <button
                    className="border p-2 w-full text-left border-primaryColor rounded text-base font-extrabold text-primaryColor"
                    onClick={() => {setIsOpenCategory(!isOpenCategory)}}
                  >
                    {ProductDetailState.category ? ProductDetailState.category.categoryName : 'Select Category'}
                  </button>
                  {isOpenCategory && (
                    <div className="absolute w-full bg-primaryColor border rounded shadow-lg z-10">
                      <ul className="list-none bg-secondary border rounded border-primaryColor text-base max-h-40 overflow-y-auto">
                        {categories.map((category) => (
                          <DropDownText 
                          key={category.categoryId}
                          listName={category.categoryName}
                          indexKey={category.categoryId}
                          onClick={() => {
                            dispatch({
                              type:"SELECT_CATEGORY",
                              payload: {
                                categoryId: category.categoryId,
                                categoryName: category.categoryName,
                              }
                            })
                          setIsOpenCategory(false); 
                          }}

                          />
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>



              {subCategories.length !== 0 && (
              <div className="flex-1 flex flex-col gap-y-2 p-2">
                <h1 className='text-primaryColor'>SUB CATEGORY</h1>
                <div className="relative">
                  <button
                    className="border p-2 w-full text-left border-primaryColor rounded text-base font-extrabold text-primaryColor"
                    onClick={() => {setIsOpenSubCategory(!isOpenSubCategory)}}
                  >
                    {ProductDetailState.subCategory ? ProductDetailState.subCategory.subCategoryName : 'Select Sub Category'}
                  </button>
                  {isOpenSubCategory && (
                    <div className="absolute w-full bg-primaryColor border rounded shadow-lg z-10">
                      <ul className="list-none bg-secondary border rounded border-primaryColor text-base">
                        {subCategories.map((subcategory) => (
                          <li
                          key={subcategory.subCategoryId}
                          className="p-2 cursor-pointer hover:bg-primaryColor hover:text-tertiaryColor text-primaryColor"
                          onClick={() => {
                            dispatch({
                            type:'SELECT_SUBCATEGORY',
                            payload: {
                              categoryId:subcategory.categoryId,
                              subCategoryId:subcategory.subCategoryId,
                              subCategoryName:subcategory.subCategoryName
                            }
                            })
                            setIsOpenSubCategory(false)
                          }}
                          >
                            {subcategory.subCategoryName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
            
        </div>
        <div className="flex flex-col p-2 gap-x-2 font-extrabold rounded border border-greyColor">
          <div className='flex flex-row justify-between items-center justify-items-center p-2'>
            <div className='flex flex-col'>
              <h3 className="text-2xl text-primaryColor font-extrabold">
              PRODUCT VARIANTS
              </h3>
              <p className='text-sm text-secondary'>A variant is required</p>
            </div>
            {!isAddingVariant && (
            <CustomButton 
            text='ADD VARIANT'
            onClick={() => {
            setisAddingVariant(!isAddingVariant);
            }}
            />
            )}
          </div>


          {ProductDetailState.variantProducts.length > 0 && (
            <div className='flex flex-col gap-y-2'>
              {ProductDetailState.variantProducts.map((variantProduct, index) => (
                <div
                  className='flex-1 w-full text-sm flex flex-row items-center justify-between border border-primaryColor p-2 rounded relative'
                  key={index}
                >
                  <IconButton
                    icon='/icons/closeicon.svg'
                    className='absolute top-1 right-1' 
                    altText='Delete Icon'
                    text='DELETE'
                    iconSize={8}
                    onClick={() => {
                      dispatch({
                        type: 'REMOVE_VARIANT',
                        payload: index,
                      });
                    }}
                  />
                  <div className='flex flex-col text-primaryColor'>
                    <h1><span className='text-secondary'>Variant Name: </span>{variantProduct.variantName}</h1>
                    <h1><span className='text-secondary'>Price: </span>{variantProduct.variantPrice}</h1>
                    {variantProduct.discount && (
                      <>
                        <h1><span className='text-secondary'>Discount Type {variantProduct.discount.discountType}: </span>
                          {variantProduct.discount.discountType === 'Percentage'
                            ? `${variantProduct.discount.discountValue}`
                            : `${variantProduct.discount.discountValue}`}
                        </h1>
                      </>
                    )}
                  </div>
                  {variantProduct.variantImages.length > 0 && (
                    <div className='flex flex-row items-center justify-center gap-2'>
                      {variantProduct.variantImages.slice(0, 3).map((variantImage, idx) => (
                        <div 
                          key={idx}
                          className="w-16 h-16 overflow-hidden rounded-lg border border-gray-200 flex items-center justify-center"
                        >
                          <Image 
                            src={URL.createObjectURL(variantImage.url)} 
                            alt="variantImages"
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        </div>
                      ))}
                      {variantProduct.variantImages.length > 3 && (
                        <div 
                          className="w-16 h-16 overflow-hidden rounded-lg flex items-center justify-center bg-secondary text-primaryColor font-bold"
                        >
                          +{variantProduct.variantImages.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}





        </div>
      </div>

      {isAddingVariant &&
      <div className='col-span-3 flex flex-col p-2 gap-y-2 font-extrabold border border-greyColor rounded'>
        <div className='flex flex-row justify-between items-center justify-items-center p-2'>
          <h1 className='text-2xl text-primaryColor font-extrabold'>PRODUCT VARIANT</h1>
          <CustomButton 
          onClick={() => {addVariant()}}
          text='SAVE VARIANT'
          />
        </div>
        <div className='flex flex-col p-2 gap-y-2 text-base font-extrabold'>
          <h1 className='text-primaryColor text-base'>VARIANT NAME</h1>
          <InputText
            placeholder="Variant Model Name"
            value={ProductVariantState.variantName ? ProductVariantState.variantName : ''}
            onChange={(e) => {
              dispatchProductVariant({
              type:'UPDATE_VARIANT_NAME',
              payload:e.target.value
              })
            }}
          />
        </div>
        
        <div className='flex flex-col p-2 gap-y-4'>
            <div className='flex flex-row justify-between tems-center justify-items-center'>
                <h1 className='text-xl text-primaryColor font-extrabold'>PRODUCT PRICING</h1>
            </div>
            <div className='flex flex-col gap-y-4'>
              <div className='flex flex-col'>
                <div className='flex flex-row p-2 gap-x-2'>
                  <CustomButton 
                  className={`flex-1 ${ProductVariantState.discount === null ? 'bg-primaryColor text-tertiaryColor' : 'text-primaryColor bg-secondary'} rounded-md px-3 py-2 font-extrabold`}
                  text='No Discount'
                  onClick={() => {
                  dispatchProductVariant({
                    type:'UPDATE_DISCOUNT_TYPE',
                    payload:null
                  })
                  }}
                  />
                  <CustomButton
                  className={`flex-1 ${ProductVariantState.discount?.discountType === 'Percentage' ? 'bg-primaryColor text-tertiaryColor' : 'text-primaryColor bg-secondary'} rounded-md px-3 py-2 font-extrabold`}
                  text="Percentage %"
                  onClick={() => {
                    dispatchProductVariant({
                      type:'UPDATE_DISCOUNT_TYPE',
                      payload:'Percentage'
                    })
                  }}
                  />
                  <CustomButton 
                  className={`flex-1 ${ProductVariantState.discount?.discountType === 'Unit' ? 'bg-primaryColor text-tertiaryColor' : 'text-primaryColor bg-secondary'} rounded-md px-3 py-2 font-extrabold`}
                  text='Unit Discount'
                  onClick={() => {
                    dispatchProductVariant({
                      type:'UPDATE_DISCOUNT_TYPE',
                      payload:'Unit'
                    })
                  }}
                  />
                </div>
              </div>
              <div className='flex flex-row gap-x-2'>
                <div className='flex-1 flex flex-col'>
                  <h1 className='text-primaryColor text-base'>Product Price</h1>
                  <InputPrice
                  type="text"
                  placeholder="Enter Variant Price"
                  isUnit={true}
                  value={ProductVariantState.variantPrice ? ProductVariantState.variantPrice : ''}
                  onChange={(e) => 
                    dispatchProductVariant({
                      type:'UPDATE_VARIANT_PRICE',
                      payload: e.target.value,
                    })
                  }
                  />
                </div>
                {ProductVariantState.discount !== null && (
                <div className='flex-1 flex flex-col'>
                  <h1 className='text-primaryColor text-base'>Discount Value</h1>
                  <InputPrice
                  type="text"
                  isUnit={ProductVariantState.discount.discountType === 'Percentage' ? false : true}
                  placeholder="Enter Discount Value"
                  value={ProductVariantState.discount.discountValue}
                  onChange={(e) => 
                    dispatchProductVariant({
                    type:'UPDATE_DISCOUNT_VALUE',
                    payload:e.target.value
                    })
                  }
                  />
                </div>
                )}
              </div>
              </div>
              
              {ProductVariantState.discount !== null && (
              <div className='flex flex-row gap-x-4'>
                <div className='flex-1 flex flex-col'>
                  <label htmlFor="start" className='text-primaryColor text-sm font-semibold mb-2'>Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={ProductVariantState.discount.startDate ? ProductVariantState.discount.startDate.toISOString().split('T')[0] : ''}
                    min="2024-01-01"
                     max={new Date().getFullYear() + 2 + "-12-31"}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      dispatchProductVariant({
                      type:'UPDATE_START_DATE',
                      payload:selectedDate
                      })
                    }} 
                    className='p-2 border border-primaryColor rounded focus:outline-none text-secondary text-base'
                  />
                </div>


                <div className='flex-1 flex flex-col'>
                  <label htmlFor="end" className='text-primaryColor text-sm font-semibold mb-2'>End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={ProductVariantState.discount.endDate ? ProductVariantState.discount.endDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    min="2024-01-01"
                    max={new Date().getFullYear() + 2 + "-12-31"}
                    onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                      dispatchProductVariant({
                      type:'UPDATE_END_DATE',
                      payload:selectedDate
                      })
                    }}
                    className='p-2 border border-primaryColor rounded focus:outline-none text-secondary text-base'
                  />
                </div>
              </div>
              )}  

        </div>

        <div className='flex flex-col p-2 gap-y-4'>
          <div className='flex flex-col items-center justify-items-center justify-center'>
            <div className='text-primaryColor text-lg'>
              <h1>THUMBNAIL</h1>
            </div>
            <div className='relative h-68 w-78 p-2 border border-secondary hover:border-primaryColor rounded group flex flex-col items-center text-center justify-center justify-items-center'>
              {getThumbNail() === null && (
                <>
                <ImageIconUpload
                  uploadImage='/icons/imageupload.svg'
                  onFileChange={(file) => 
                    dispatchProductVariant({
                      type: 'ADD_VARIANT_IMAGES',
                      payload: {
                        url: file,
                        isMain: true,
                      }
                    })
                  }
                />
                <h1 className='text-secondary group-hover:text-primaryColor'>No Selected Image ThumbNail</h1>
                </>
              )}
              {ProductVariantState.variantImages
                .map((variantImage, index) => ({ variantImage, index })) // Map original index onto the variantImage
                .filter(({ variantImage }) => variantImage.isMain) // Filter by isMain
                .map(({ variantImage, index: originalIndex }) => ( // Use the original index here
                  <Fragment key={originalIndex}>  {/* Use originalIndex as the key */}
                    <div className="absolute top-2 right-2 z-10">
                      <IconButton 
                        icon='/icons/closeicon.svg'
                        altText='Delete Icon'
                        text='DELETE'
                        iconSize={8}
                        onClick={() => {
                          // Dispatch with the original index to remove the correct image
                          dispatchProductVariant({
                            type: 'REMOVE_IMAGE',
                            payload: originalIndex,  // Use the original index for the deletion
                          });
                        }}
                      />
                    </div>
                    <Image 
                      src={variantImage.url instanceof File ? URL.createObjectURL(variantImage.url) : variantImage.url} 
                      alt="thumbNail"
                      fill
                      className="object-contain"
                    />
                  </Fragment>
              ))}
            </div>
          </div>
          {ProductVariantState.variantImages.length !== 0 &&(
          <div className='flex flex-row gap-x-2'>
            <div className='relative h-45 w-50 p-2 border border-secondary hover:border-primaryColor rounded group flex flex-col items-center text-center justify-center justify-items-center'>
              <ImageIconUpload
              uploadImage='/icons/imageupload.svg'
              onFileChange={(file) =>
              dispatchProductVariant({
                type:'ADD_VARIANT_IMAGES',
                payload:{
                  url:file,
                  isMain:false
                }
              })  
              }
              />
              <h1 className='text-secondary group-hover:text-primaryColor'>No Selected Image</h1>
            </div>
            {ProductVariantState.variantImages !== null && (
              ProductVariantState.variantImages
                .map((variantImage, index) => ({ variantImage, index }))
                .filter(({ variantImage }) => !variantImage.isMain) 
                .map(({ variantImage, index }) => ( 
                  <div 
                    key={index}
                    className='relative h-45 w-50 p-2 border border-secondary hover:border-primaryColor rounded group flex flex-col items-center text-center justify-center justify-items-center'>
                    <div className="absolute top-2 right-2 z-10">
                      <IconButton 
                        icon='/icons/closeicon.svg'
                        altText='Delete Icon'
                        text='DELETE'
                        onClick={() => {
                          dispatchProductVariant({
                            type:'REMOVE_IMAGE',
                            payload: index 
                          })
                        }}
                        iconSize={8}
                      />
                    </div>
                    <Image 
                      src={variantImage.url instanceof File ? URL.createObjectURL(variantImage.url) : variantImage.url} 
                      alt="thumbNail"
                      fill
                      className="object-contain"
                    />
                  </div>
                ))
            )}
          </div>
          )}









          
        </div>
      </div>
      }





    </div>
  )
}

