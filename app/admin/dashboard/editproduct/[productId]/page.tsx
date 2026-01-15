'use client';
import { useReducer } from 'react';
import { usePathname } from 'next/navigation'; 

import { UIComponentReducer, initialUIComponent } from '@/lib/api/reDucer';
import { createProduct } from '@/lib/api/productService';

import {
  InputText,
  TextBox,
  CustomButton,
  InputPrice,
  DashboardSelectBrand,
  DashboardSelectCategory,
  DashboardSelectSubCategory,
  ProductMedia,
  DashboardVariantsComponent,
} from '@/components'


export interface VariantDetails{
  variantTypeName: string;
  variantOptions: VariantOption[];
}

export interface VariantOption {
    variantOptionValue:string;
    price_adjusting:string;
    variant_image: File | null;
}

interface ProductImage {
  file: File;
  isMain: boolean;
}

interface ProductDetails {
  productTitle: string;
  basePrice:string;
  brandId: number | null;
  categoryId: number | null;
  subCategoryId:number | null;
  description: string | null;
  features: string | null;
  specifications: string | null;
  variants: VariantDetails[];
  medias: ProductImage[];
}

export type ProductDetailAction = 
 | { type: 'CLEAR_INPUTS'; payload: ProductDetails} 
 | { type: 'UPDATE_PRODUCT_TITLE'; payload: string} 
 | { type: 'UPDATE_BASE_PRICE'; payload: string} 
 | { type: 'UPDATE_DESCRIPTION'; payload: string | null} 
 | { type: 'UPDATE_FEATURES'; payload: string | null} 
 | { type: 'UPDATE_SPECIFICATIONS'; payload: string | null} 
 | { type: 'ADD_MEDIAS'; payload: ProductImage[] } 
 | { type: 'ADD_VARIANTS'; payload: VariantDetails } 
 | { type: 'SELECT_BRAND'; payload: number}  
 | { type: 'SELECT_BRAND_DELETE';}  
 | { type: 'SELECT_CATEGORY'; payload: number} 
 | { type: 'SELECT_CATEGORY_DELETE'; } 
 | { type: 'SELECT_SUBCATEGORY'; payload:number} 
 | { type: 'SELECT_SUBCATEGORY_DELETE';} 
 | { type: 'UPDATE_MAIN_IMAGE'; payload:number} 
 | { type: 'DELETE_PRODUCT_IMAGE'; payload:number}
 | { type: 'SELECT_PRODUCT_IMAGE_THUMBNAIL'; payload:number}
 | { type: 'ADJUST_PRICE'; payload: {variantIndex:number, price_adjust:string,optiontIndex:number}}
 | { type: 'ADD_IMAGE_VARIANT'; payload: {variantIndex:number, variantImage:File,optiontIndex:number}}
 | { type: 'REMOVE_VARIANT_IMAGE'; payload: {variantIndex:number, optionIndex:number}}

 

function ProductDetailReducer(
  state: ProductDetails,
  action: ProductDetailAction
): ProductDetails {
  switch (action.type) {
    case 'CLEAR_INPUTS' : {
      return {...action.payload}
    }
    case "UPDATE_PRODUCT_TITLE": {
      return { ...state, productTitle: action.payload };
    }
    case "UPDATE_BASE_PRICE": {
      const price = action.payload
      return { ...state, basePrice: String(Number(price).toFixed(2))};
    }
    case "UPDATE_DESCRIPTION": {
      return { ...state, description: action.payload };
    }
    case "UPDATE_SPECIFICATIONS": {
      return { ...state, specifications: action.payload };
    }
    case "UPDATE_FEATURES": {
      return { ...state, features: action.payload };
    }
    case "ADD_MEDIAS": {
      return {
        ...state,
        medias: state.medias
          ? [...state.medias, ...action.payload]
          : [...action.payload],
      };
    }
    case "ADD_VARIANTS": {
      console.log(action.payload)
      return {
        ...state,
        variants:[...state.variants,action.payload]
      };
    }
    case "SELECT_BRAND": {
      return {
        ...state,
        brandId: action.payload,
      };
    }
    case 'SELECT_BRAND_DELETE': {
      return {
        ...state,
        brandId:null
      }
    }
    case "SELECT_CATEGORY": {
      return {
        ...state,
        categoryId: action.payload,
      };
    }
    case "SELECT_CATEGORY_DELETE": {
      return {
        ...state,
        categoryId:null
      }
    }
    case "SELECT_SUBCATEGORY": {
      return {
        ...state,
        subCategoryId: action.payload,
      };
    }
    case "SELECT_SUBCATEGORY_DELETE": {
      return {
        ...state,
        subCategoryId:null
      }
    }
    case "UPDATE_MAIN_IMAGE": {
      const updatedMedias = state.medias.map((media, index) => ({
        ...media,
        isMain: index === action.payload ? true : media.isMain, 
      }));
      return {
        ...state,
        medias: updatedMedias,
      };
    }
    case "DELETE_PRODUCT_IMAGE": {
        return {
        ...state,
        medias: state.medias.filter((_, index) => index !== action.payload),
      };
    }
  case 'SELECT_PRODUCT_IMAGE_THUMBNAIL': {
    const updatedMedias = state.medias.map((media, index) => ({
      ...media,
      isMain: index === action.payload ? true : false, 
    }));
    return {
      ...state,
      medias: updatedMedias,
    };
  }
  case "ADJUST_PRICE":
    const updatedVariantOptions = state.variants.map((variant, variantIndex) => {
        if (variantIndex === action.payload.variantIndex) {
            const updatedOptions = variant.variantOptions.map((option, optionIndex) => {
                if (optionIndex === action.payload.optiontIndex) {
                    const price = action.payload.price_adjust
                    return { ...option, price_adjusting: String(Number(price).toFixed(2))};
                }
                return option;
            });
            return { ...variant, variantOptions: updatedOptions };
        }
        return variant;
    });
    return {
        ...state,
        variants: updatedVariantOptions,
    };

  case 'ADD_IMAGE_VARIANT':
      console.log(action.payload.variantImage)
      const updateImagevariant = state.variants.map((variant, variantIndex) => {
          if (variantIndex === action.payload.variantIndex) {
              const updatedOptions = variant.variantOptions.map((option, optionIndex) => {
                  if (optionIndex === action.payload.optiontIndex) {
                      return { ...option, variant_image: action.payload.variantImage };
                  }
                  return option;
              });
              return { ...variant, variantOptions: updatedOptions };
          }
          return variant;
      });
      return {
          ...state,
          variants: updateImagevariant,
      };
  case 'REMOVE_VARIANT_IMAGE': 
      const updateImagevariantremove = state.variants.map((variant, variantIndex) => {
          if (variantIndex === action.payload.variantIndex) {
              const updatedOptions = variant.variantOptions.map((option, optionIndex) => {
                  if (optionIndex === action.payload.optionIndex) {
                      return { ...option, variant_image: null };
                  }
                  return option;
              });
              return { ...variant, variantOptions: updatedOptions };
          }
          return variant;
      });
      return {
          ...state,
          variants: updateImagevariantremove,
      };
  default:
    return state;
  }
}


  export default function page() {
  const pathname = usePathname(); 

  const initialUiComponent: initialUIComponent = {
    descriptionUI: false,
    specificationsUI:false,
    featuresUI:false,
  }

  const initialProductDetailState = {
    productTitle:'',
    basePrice:'',
    description: null,
    features:null,
    brandId:null,
    categoryId:null,
    subCategoryId:null,
    specifications:null,
    variants: [],
    medias:[]
  }

  const [initialUIComponentState, dispatchInitialUIComponent] = useReducer(UIComponentReducer,initialUiComponent)
  const [ProductDetailState, dispatchProductDetail] = useReducer(ProductDetailReducer,initialProductDetailState)

  const handleValidateProductDetail = () => {
    const {
      productTitle,
      basePrice,
      brandId,
      categoryId,
      subCategoryId,
      variants,
      medias
    } = ProductDetailState;

    const checkPrice = (price:string) => {
      return parseFloat(price.replace(/[^0-9.-]+/g, ''))
    }

    if (!productTitle.trim() && brandId === null && categoryId === null &&  subCategoryId === null){
      return false;
    }

    if (isNaN(checkPrice(basePrice))) {
      if(checkPrice(basePrice) === 0){
        const isvalidPricing = variants.some(variant =>
          variant.variantOptions.some(option => isNaN(checkPrice(option.price_adjusting)) || checkPrice(option.price_adjusting) === 0)
        );
        if (isvalidPricing) {
          console.log('Zero Base and Variant Price')
          return false;
        }
      }
      else {
        return false;
      }
    }

    if (Array.isArray(medias) && Array.isArray(variants)) {
      const hasMediaThumbnail = medias.some(media => media.isMain === true);
      const hasVariantImage = variants.every(variant =>
        Array.isArray(variant.variantOptions) &&
        variant.variantOptions.every(
          option => option.variant_image !== null && option.variant_image !== undefined
        )
      );
      if (medias.length > 0) {
        if (!hasMediaThumbnail) {
          return false;
        }
        return true; 
      }
      if (!hasVariantImage) {
        return false;
      }
      return true;
    }
    return true;
  };

  const handleProductAdd = async () => {
    let validated = handleValidateProductDetail()
    if(validated){
      await createProduct(ProductDetailState)
      dispatchProductDetail({
        type:'CLEAR_INPUTS',
        payload:initialProductDetailState
      })
    }
    else {
      alert('wrong inputs')
    }
    
  }

  return (
  <div className='flex flex-col gap-y-2'>
    <div className='flex flex-col border border-greyColor p-2 gap-y-4 font-extrabold rounded bg-blackgroundColor'>
      <div className='flex flex-row justify-between items-center justify-items-center p-2'>
        <h3 className="text-2xl text-primaryColor font-extrabold">
        PRODUCT DETAILS EDIT
        </h3>
        <CustomButton 
        text='SAVE PRODUCT'
        onClick={handleProductAdd}
        />
      </div>
      <div className='flex flex-row border-t border-greyColor'>
        <div className='flex-1 flex flex-col gap-y-2 p-2'>
          <h1 className='text-primaryColor text-lg'>PRODUCT TITLE</h1>
          <InputText
          placeholder="Product Title"
          value={ProductDetailState.productTitle}
          onChange={(e) => {
            dispatchProductDetail({
            type:'UPDATE_PRODUCT_TITLE',
            payload:e.target.value
            });
          }}
          />
          <p className='text-sm text-secondary'>A product title is required</p>
        </div>
        <div className='flex-1 flex flex-col gap-y-2 p-2'>
          <h1 className='text-primaryColor text-lg'>BASE PRICE</h1>
          <InputPrice
          isUnit={true}
          placeholder="Base Price"
          value={`${ProductDetailState.basePrice}`}
          onChange={(e) => {
            dispatchProductDetail({
            type:'UPDATE_BASE_PRICE',
            payload:e.target.value
            });
          }}
          />
          <p className='text-sm text-secondary'>A base price is required</p>
        </div>
      </div>

      <div className='flex flex-col border-t border-greyColor'>
        <TextBox 
        onClick={() => {
          dispatchInitialUIComponent({
          type: 'UPDATE_FIELD',
          field: 'descriptionUI',
          value: !initialUIComponentState.descriptionUI,
          });
        }}
        categoryLength={ProductDetailState.description ? ProductDetailState.description.length : 0}
        textBoxCategory='DESCRIPTION'
        isOpenBox={initialUIComponentState.descriptionUI}
        textBoxValue={ProductDetailState.description || ''}
        onChange={(e) => {
          dispatchProductDetail({
          type:"UPDATE_DESCRIPTION",
          payload:e.target.value
          });
        }}
        />
        <TextBox 
          onClick={() => {
            dispatchInitialUIComponent({
            type: 'UPDATE_FIELD',
            field: 'specificationsUI',
            value: !initialUIComponentState.specificationsUI,
            });
        }}
        categoryLength={ProductDetailState.specifications ? ProductDetailState.specifications.length : 0}
        textBoxCategory='SPECIFICATIONS'
        isOpenBox={initialUIComponentState.specificationsUI}
        textBoxValue={ProductDetailState.specifications || ''}
        onChange={(e) => {
          dispatchProductDetail({
          type:"UPDATE_SPECIFICATIONS",
          payload:e.target.value
          });
        }}
        />
        <TextBox 
        onClick={() => {
          dispatchInitialUIComponent({
          type: 'UPDATE_FIELD',
          field: 'featuresUI',
          value: !initialUIComponentState.featuresUI,
          });
        }}
        categoryLength={ProductDetailState.features ? ProductDetailState.features.length : 0}
        textBoxCategory='FEATURES'
        isOpenBox={initialUIComponentState.featuresUI}
        textBoxValue={ProductDetailState.features || ''}
        onChange={(e) => {
          dispatchProductDetail({
          type: "UPDATE_FEATURES",
          payload:e.target.value
          })
        }}
        />
      </div>
      <div className='border-t border-greyColor flex flex-row p-4 gap-x-4'>
        <DashboardSelectBrand 
          dispatchProductDetail={dispatchProductDetail}
        />
        <DashboardSelectCategory 
          dispatchProductDetail={dispatchProductDetail}
        />
        {ProductDetailState.categoryId && (
        <DashboardSelectSubCategory 
          dispatchProductDetail={dispatchProductDetail}
          categoryId={ProductDetailState.categoryId}
        />)}
      </div>
    </div>
    <ProductMedia 
      medias={ProductDetailState.medias}
      dispatchProductDetail={dispatchProductDetail}
    />
    <DashboardVariantsComponent 
      variantsList={ProductDetailState.variants}
      basePrice={ProductDetailState.basePrice}
      dispatchProductDetail={dispatchProductDetail}
    />
  </div>
  )
}

