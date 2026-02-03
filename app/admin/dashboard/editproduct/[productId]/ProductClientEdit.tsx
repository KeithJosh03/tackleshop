'use client';

import { useEffect, useReducer } from "react";
import { 
  InputText,
  CustomButton,
  InputPrice,
  TextBox,
  ProductMedia,
  DashboardSelectBrand,
  DashboardSelectCategory,
  DashboardSelectSubCategory,
  DashboardVariantsComponent
} from "@/components";

import { ProductDetailsEditProps } from "@/types/productTypes";
import { BrandProps } from "@/types/brandType";
import { Category } from "@/types/categoryType";
import { SubCategory } from "@/types/subCategoryTypes";
import { ProductMedias } from "@/types/productMedia";

import { UIComponentReducer, initialUIComponent } from '@/lib/api/reDucer';



export type ProductDetailActionEdit =
  | { type: 'SET_INITIAL_PRODUCT'; payload: ProductDetailsEditProps }
  | { type: 'UPDATE_PRODUCT_TITLE'; payload: string}
  | { type: 'UPDATE_BASE_PRICE'; payload: string}
  | { type: 'UPDATE_DESCRIPTION'; payload: string}
  | { type: 'UPDATE_SPECIFICATION'; payload: string}
  | { type: 'UPDATE_FEATURES'; payload: string}
  | { type: 'UPDATE_BRAND'; payload:BrandProps}
  | { type: 'REMOVE_BRAND';}
  | { type: 'UPDATE_CATEGORY'; payload:Category}
  | { type: 'REMOVE_CATEGORY';}
  | { type: 'UPDATE_SUBCATEGORY'; payload:SubCategory}
  | { type: 'REMOVE_SUBCATEGORY';}
  | { type: 'UPDATE_MEDIA_MAIN'; payload:number  } 
  | { type: 'REMOVE_MEDIA'; payload:number  } 
  | { type: 'UPDATE_PRICE_OPTION'; payload: { variantTypeId:number, variantOptionPrice:string,variantOptionId:number}}
  | { type: 'UPDATE_VARIANT_TYPE'; payload: { variantTypeId:number, variantTypeName:string}}
  | { type: 'REMOVE_VARIANT_TYPE'; payload: { variantTypeId:number}}
  | { type: 'UPDATE_VARIANT_OPTION_NAME'; payload: { variantTypeId:number, variantOptionValue:string,variantOptionId:number}}
  | { type: 'REMOVE_VARIANT_OPTION_NAME'; payload: { variantTypeId:number ,variantOptionId:number }}







const initialProductDetailState: ProductDetailsEditProps = {
  productId:0,
  productTitle: '',
  basePrice: '',
  description: null,
  features: null,
  specifications: null,
  brand: null,
  category: {
    categoryName:'',
    categoryId:0
  },
  subCategory: {
    subCategoryId:0,
    subCategoryName:''
  },
  productVariantsTypes: [],
  productMedias: [],
};



function ProductDetailEditReducer(
  state: ProductDetailsEditProps,
  action: ProductDetailActionEdit
): ProductDetailsEditProps {
  switch (action.type) {
    case 'SET_INITIAL_PRODUCT':
      return {
        ...action.payload,
        productVariantsTypes: action.payload.productVariantsTypes ?? [],
        productMedias: action.payload.productMedias ?? [],
      };
    case 'UPDATE_PRODUCT_TITLE':
      return { ...state, productTitle: action.payload }
    case 'UPDATE_BASE_PRICE':
      return { ...state, basePrice: action.payload }
    case 'UPDATE_DESCRIPTION':
      return { ...state, description: action.payload }
    case 'UPDATE_SPECIFICATION':
      return { ...state, specifications: action.payload }
    case 'UPDATE_FEATURES':
      return { ...state, features: action.payload }
    case "UPDATE_BRAND": 
      return {
        ...state, brand:action.payload
      }
    case "REMOVE_BRAND":
      return {
        ...state, brand: null
      }
    case "UPDATE_CATEGORY": 
      return {
        ...state, category:action.payload
      }
    case "REMOVE_CATEGORY":
      return { ...state, category:null}
    case "UPDATE_SUBCATEGORY": 
      return { ...state, subCategory:action.payload }
    case "REMOVE_SUBCATEGORY": 
      return { ...state, subCategory:null}
    case "UPDATE_PRICE_OPTION": {
      const updatedVariantOptions = state.productVariantsTypes.map((variant) => {
        if (variant.variantTypeId === action.payload.variantTypeId) {
            const updatedOptions = variant.variantOptions.map((option) => {
                if (option.variantOptionId === action.payload.variantOptionId) {
                    const price = action.payload.variantOptionPrice
                    return { ...option, variantOptionPrice: String(Number(price).toFixed(2))};
                }
                return option;
            });
            return { ...variant, variantOptions: updatedOptions };
        }
        return variant;
      });
      return {
          ...state,
          productVariantsTypes: updatedVariantOptions,
      };
    }
    case "UPDATE_VARIANT_TYPE": {
      const updatedVariantType = state.productVariantsTypes.map((variant) => {
        if (variant.variantTypeId === action.payload.variantTypeId) {
            return { ...variant, variantTypeName: action.payload.variantTypeName };
        }
        return variant;
      });
      return {
          ...state,
          productVariantsTypes: updatedVariantType,
      };
    }
    case "UPDATE_VARIANT_OPTION_NAME": {
      const updatedVariantOptions = state.productVariantsTypes.map((variant) => {
        if (variant.variantTypeId === action.payload.variantTypeId) {
            const updatedOptions = variant.variantOptions.map((option) => {
                if (option.variantOptionId === action.payload.variantOptionId) {
                    const optionValue = action.payload.variantOptionValue
                    return { ...option, variantOptionValue: optionValue};
                }
                return option;
            });
            return { ...variant, variantOptions: updatedOptions };
        }
        return variant;
      });
      return {
          ...state,
          productVariantsTypes: updatedVariantOptions,
      };
    }
    case "REMOVE_VARIANT_OPTION_NAME": {
      console.log(action.payload)
    }
    case "REMOVE_VARIANT_TYPE": {
      console.log(action.payload)
    }
    case "REMOVE_MEDIA": {
      if (!state.productMedias) {
        return state;
      }
      const filteredMedias = state.productMedias.filter(
        media => media.productImgId !== action.payload
      );
      return {
        ...state,
        productMedias: filteredMedias.length ? filteredMedias : null,
      };
    }
    case "UPDATE_MEDIA_MAIN": {
      const updatedMedias =
        state.productMedias?.map(media => ({
          ...media,
          isMain: media.productImgId === action.payload,
        })) ?? null;

      return {
        ...state,
        productMedias: updatedMedias,
      };
    }
    default:
      return state;
  }
}


export default function EditProductClient({
  productDetailEditProps,
}: {
  productDetailEditProps: ProductDetailsEditProps;
}) {
  const [productDetailState, dispatchProductDetailEdit] = useReducer(
    ProductDetailEditReducer,
    initialProductDetailState
  );

  const initialUiComponent: initialUIComponent = {
    descriptionUI: false,
    specificationsUI:false,
    featuresUI:false,
  }

  const [initialUIComponentState, dispatchInitialUIComponent] = useReducer(UIComponentReducer,initialUiComponent)

  useEffect(() => {
    if (productDetailEditProps) {
      dispatchProductDetailEdit({
        type: 'SET_INITIAL_PRODUCT',
        payload: productDetailEditProps,
      });
    }
  }, [productDetailEditProps]);


  const handleProductEdit = async () => {
    console.log(productDetailState)
    // let validated = handleValidateProductDetail()
    // if(validated){
    //   await createProduct(ProductDetailState)
    //   dispatchProductDetailCreate({
    //     type:'CLEAR_INPUTS',
    //     payload:initialProductDetailState
    //   })
    // }
    // else {
    //   alert('wrong inputs')
    // }
  }

return (
<div className='flex flex-col gap-y-2'>
    <div className='flex flex-col border border-greyColor p-2 gap-y-4 font-extrabold rounded bg-blackgroundColor'>
      <div className='flex flex-row justify-between items-center justify-items-center p-2'>
        <h3 className="text-2xl text-primaryColor font-extrabold">
        PRODUCT DETAILS EDIT
        </h3>
        <div className="flex flex-row gap-x-2">
          <CustomButton 
          text='SAVE EDIT'
          onClick={handleProductEdit}
          />
          <CustomButton 
          text='DELETE'
          onClick={handleProductEdit}
          />
        </div>
      </div>
      <div className='flex flex-row border-t border-greyColor'>
        <div className='flex-1 flex flex-col gap-y-2 p-2'>
          <h1 className='text-primaryColor text-lg'>PRODUCT TITLE</h1>
          <InputText
          placeholder="Product Title"
          value={productDetailState.productTitle}
          onChange={(e) => {
            dispatchProductDetailEdit({
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
          value={`${productDetailState.basePrice}`}
          onChange={(e) => {
            dispatchProductDetailEdit({
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
        categoryLength={productDetailState.description ? productDetailState.description.length : 0}
        textBoxCategory='DESCRIPTION'
        isOpenBox={initialUIComponentState.descriptionUI}
        textBoxValue={productDetailState.description || ''}
        onChange={(e) => {
          dispatchProductDetailEdit({
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
        categoryLength={productDetailState.specifications ? productDetailState.specifications.length : 0}
        textBoxCategory='SPECIFICATIONS'
        isOpenBox={initialUIComponentState.specificationsUI}
        textBoxValue={productDetailState.specifications || ''}
        onChange={(e) => {
          dispatchProductDetailEdit({
          type:"UPDATE_SPECIFICATION",
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
        categoryLength={productDetailState.features ? productDetailState.features.length : 0}
        textBoxCategory='FEATURES'
        isOpenBox={initialUIComponentState.featuresUI}
        textBoxValue={productDetailState.features || ''}
        onChange={(e) => {
          dispatchProductDetailEdit({
          type: "UPDATE_FEATURES",
          payload:e.target.value
          })
        }}
        />
      </div>
      <div className='border-t border-greyColor flex flex-row p-4 gap-x-4'>
        <DashboardSelectBrand
          choosenBrand={productDetailState.brand}    
          ProductDetailEditReducer={dispatchProductDetailEdit}
          reducerType="EDIT"
        />
        <DashboardSelectCategory
          currentCategory={productDetailState.category} 
          ReducerType="EDIT"
          ProductDetailEditReducer={dispatchProductDetailEdit}
        />
        {productDetailState.category && (
        <DashboardSelectSubCategory 
          ProductDetailEditReducer={dispatchProductDetailEdit}
          ReducerType="EDIT"
          currentCategory={productDetailState.category}
          currentSubCategory={productDetailState.subCategory}
        />)}
      </div>
    </div>
    <ProductMedia 
      currentMedias={productDetailState.productMedias}
      ProductDetailEditReducer={dispatchProductDetailEdit}
      ReducerType="EDIT"
    />
    {(Array.isArray(productDetailState.productVariantsTypes) &&
    productDetailState.productVariantsTypes.length > 0
    ) && ( 
    <DashboardVariantsComponent 
      ReduceType="EDIT"
      currentVariants={productDetailState.productVariantsTypes}
      basePrice={productDetailState.basePrice}
      ProductDetailEditReducer={dispatchProductDetailEdit}
    />
    )}
    
  </div>
  );
}
