'use client';
import { useReducer, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { createProduct } from '@/lib/api/productService';
import { BrandProps } from '@/types/brandType';
import { Category } from '@/types/categoryType';
import { SubCategory } from '@/types/subCategoryTypes';

import {
  InputText,
  InputPrice,
  DashboardSelectBrand,
  DashboardSelectCategory,
  DashboardSelectSubCategory,
  ProductMedia,
  DashboardVariantsComponent,
  ProductContentInputs,
  SectionCard,
  FieldError,
  FieldHint,
} from '@/components'

export interface VariantDetails {
  variantTypeName: string;
  variantOptions: VariantOption[];
}

export interface VariantOption {
  variantOptionValue: string;
  price_adjusting: string;
  variant_image: File | null;
}

interface ProductImage {
  file: File;
  isMain: boolean;
}

interface ProductDetails {
  productTitle: string;
  basePrice: string;
  brand: BrandProps | null;
  category: Category | null;
  subCategory: SubCategory | null;
  description: string | null;
  features: string | null;
  specifications: string | null;
  variants: VariantDetails[];
  medias: ProductImage[];
}

export type ProductDetailActionCreate =
  | { type: 'CLEAR_INPUTS'; payload: ProductDetails }
  | { type: 'UPDATE_PRODUCT_TITLE'; payload: string }
  | { type: 'UPDATE_BASE_PRICE'; payload: string }
  | { type: 'UPDATE_DESCRIPTION'; payload: string | null }
  | { type: 'UPDATE_FEATURES'; payload: string | null }
  | { type: 'UPDATE_SPECIFICATIONS'; payload: string | null }
  | { type: 'ADD_MEDIAS'; payload: ProductImage[] }
  | { type: 'ADD_VARIANTS'; payload: VariantDetails }
  | { type: 'SELECT_BRAND'; payload: BrandProps }
  | { type: 'REMOVE_BRAND'; }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'REMOVE_CATEGORY'; }
  | { type: 'SELECT_SUBCATEGORY'; payload: SubCategory }
  | { type: 'SELECT_SUBCATEGORY_DELETE'; }
  | { type: 'UPDATE_MAIN_IMAGE'; payload: number }
  | { type: 'DELETE_PRODUCT_IMAGE'; payload: number }
  | { type: 'SELECT_PRODUCT_IMAGE_THUMBNAIL'; payload: number }
  | { type: 'ADJUST_PRICE'; payload: { variantIndex: number, price_adjust: string, optiontIndex: number } }
  | { type: 'ADD_IMAGE_VARIANT'; payload: { variantIndex: number, variantImage: File, optiontIndex: number } }
  | { type: 'REMOVE_VARIANT_IMAGE'; payload: { variantIndex: number, optionIndex: number } }



function ProductDetailCreateReducer(
  state: ProductDetails,
  action: ProductDetailActionCreate
): ProductDetails {
  switch (action.type) {
    case 'CLEAR_INPUTS': {
      return { ...action.payload }
    }
    case "UPDATE_PRODUCT_TITLE": {
      return { ...state, productTitle: action.payload };
    }
    case "UPDATE_BASE_PRICE": {
      const price = action.payload
      return { ...state, basePrice: String(Number(price).toFixed(2)) };
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
        variants: [...state.variants, action.payload]
      };
    }
    case "SELECT_BRAND": {
      return {
        ...state,
        brand: action.payload,
      };
    }
    case 'REMOVE_BRAND': {
      return {
        ...state,
        brand: null
      }
    }
    case "UPDATE_CATEGORY": {
      return {
        ...state,
        category: action.payload,
      };
    }
    case "REMOVE_CATEGORY": {
      return { ...state, category: null }
    }
    case "SELECT_SUBCATEGORY": {
      return {
        ...state,
        subCategory: action.payload,
      };
    }
    case "SELECT_SUBCATEGORY_DELETE": {
      return {
        ...state,
        subCategory: null
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
              return { ...option, price_adjusting: String(Number(price).toFixed(2)) };
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

/* ─── SectionCard, FieldError, FieldHint are now imported from @/components ── */

export default function page() {

  const initialProductDetailState = {
    productTitle: '',
    basePrice: '',
    description: null,
    features: null,
    brand: null,
    category: null,
    subCategory: null,
    specifications: null,
    variants: [],
    medias: []
  }

  const [ProductDetailState, dispatchProductDetailCreate] = useReducer(ProductDetailCreateReducer, initialProductDetailState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null)

  const validate = () => {
    const {
      productTitle, basePrice, brand, category,
      subCategory, description, variants, medias
    } = ProductDetailState;

    const newErrors: Record<string, string> = {}
    const parsePrice = (price: string | undefined | null) => {
      if (!price) return NaN;
      return parseFloat(price.replace(/[^0-9.-]+/g, ''));
    };

    if (!productTitle || !productTitle.trim())
      newErrors.productTitle = 'Product title is required.';

    if (!brand) newErrors.brand = 'Please select a brand.';
    if (!category) newErrors.category = 'Please select a category.';
    if (!subCategory) newErrors.subCategory = 'Please select a sub-category.';

    if (!description || !description.trim())
      newErrors.description = 'Description is required.';

    const parsedBasePrice = parsePrice(basePrice);
    if (isNaN(parsedBasePrice)) {
      newErrors.basePrice = 'Enter a valid base price.';
    } else if (parsedBasePrice === 0) {
      if (!variants || variants.length === 0) {
        newErrors.basePrice = 'Add at least one variant with a price when base price is ₱0.';
      } else {
        const hasInvalidVariantPrice = variants.some(v =>
          !v.variantOptions || v.variantOptions.length === 0 ||
          v.variantOptions.some(o => {
            const p = parsePrice(o.price_adjusting);
            return isNaN(p) || p === 0;
          })
        );
        if (hasInvalidVariantPrice)
          newErrors.basePrice = 'All variant options must have a non-zero price adjustment.';
      }
    }

    const isMediasEmpty = !medias || medias.length === 0;
    if (isMediasEmpty) {
      if (!variants || variants.length === 0) {
        newErrors.media = 'Upload at least one product image, or add at least one variant.';
      }
    } else {
      const hasThumb = medias.some(m => m.isMain === true);
      if (!hasThumb)
        newErrors.media = 'Please select a thumbnail image.';
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProductAdd = async () => {
    if (!validate()) return;
    setIsSaving(true)
    setStatusMessage(null)
    try {
      await createProduct(ProductDetailState)
      dispatchProductDetailCreate({ type: 'CLEAR_INPUTS', payload: initialProductDetailState })
      setErrors({})
      setStatusType('success')
      setStatusMessage('Product created successfully!')
      setTimeout(() => {
        setStatusMessage(null)
        setStatusType(null)
      }, 5000)
    } catch (error: any) {
      setStatusType('error')
      setStatusMessage(error.message || 'Failed to create product.')
      setTimeout(() => {
        setStatusMessage(null)
        setStatusType(null)
      }, 7000)
    } finally {
      setIsSaving(false)
    }
  }


  const completionCount = [
    !!ProductDetailState.productTitle.trim(),
    !!ProductDetailState.basePrice,
    !!ProductDetailState.brand,
    !!ProductDetailState.category,
    !!ProductDetailState.subCategory,
    !!(ProductDetailState.description?.trim()),
    ProductDetailState.medias.length > 0 || ProductDetailState.variants.length > 0,
  ].filter(Boolean).length;

  return (
    <div className='flex flex-col gap-y-4 pb-10'>

      {/* ── Sticky page header ── */}
      <div className='sticky top-0 z-20 rounded-xl border border-greyColor px-5 py-3 flex items-center justify-between gap-4'
        style={{
          background: 'linear-gradient(90deg,rgba(17,26,45,0.98) 0%,rgba(19,29,41,0.98) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.5)',
        }}>
        <div className='flex items-center gap-4'>
          <div>
            <p className='text-xs text-secondary uppercase tracking-widest font-bold'>Admin / Products</p>
            <h1 className='text-xl font-black text-primaryColor leading-tight'>Add New Product</h1>
          </div>
          {/* completion pills */}
          <div className='hidden sm:flex items-center gap-2'>
            <div className='flex gap-1'>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i}
                  className='h-1.5 w-5 rounded-full transition-all duration-300'
                  style={{ background: i < completionCount ? '#E89347' : 'rgba(131,93,50,0.3)' }}
                />
              ))}
            </div>
            <span className='text-xs text-secondary font-semibold'>{completionCount}/7 fields</span>
          </div>
        </div>

        <button
          onClick={handleProductAdd}
          disabled={isSaving}
          className='flex items-center gap-2 px-5 py-2.5 rounded-lg font-extrabold text-sm uppercase tracking-wider transition-all duration-200 disabled:opacity-60'
          style={{
            background: isSaving ? '#835d32' : 'linear-gradient(135deg,#E89347 0%,#b8692e 100%)',
            color: '#fff',
            boxShadow: isSaving ? 'none' : '0 0 18px 2px rgba(232,147,71,0.35)',
          }}
        >
          {isSaving ? (
            <>
              <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
              </svg>
              Save Product
            </>
          )}
        </button>
      </div>

      {/* ── Section 1 · Basic Info ── */}
      <SectionCard step={1} title='Basic Information'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-primaryColor uppercase tracking-wider'>
              Product Title <span className='text-red-400'>*</span>
            </label>
            <InputText
              placeholder='e.g. Shimano Fishing Rod Pro 3000'
              value={ProductDetailState.productTitle}
              onChange={(e: any) => {
                dispatchProductDetailCreate({ type: 'UPDATE_PRODUCT_TITLE', payload: e.target.value });
                if (errors.productTitle) setErrors(p => ({ ...p, productTitle: '' }));
              }}
            />
            {errors.productTitle
              ? <FieldError msg={errors.productTitle} />
              : <FieldHint msg='Give your product a clear, descriptive name.' />}
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-primaryColor uppercase tracking-wider'>
              Base Price <span className='text-red-400'>*</span>
            </label>
            <InputPrice
              isUnit={true}
              placeholder='e.g. 1500.00'
              value={`${ProductDetailState.basePrice}`}
              onChange={(e) => {
                dispatchProductDetailCreate({ type: 'UPDATE_BASE_PRICE', payload: e.target.value });
                if (errors.basePrice) setErrors(p => ({ ...p, basePrice: '' }));
              }}
            />
            {errors.basePrice
              ? <FieldError msg={errors.basePrice} />
              : <FieldHint msg='Set ₱0 if pricing is handled per variant option.' />}
          </div>
        </div>
      </SectionCard>

      {/* ── Section 2 · Categorisation ── */}
      <SectionCard step={2} title='Categorisation'>
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1 min-w-[180px] flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-primaryColor uppercase tracking-wider'>
              Brand <span className='text-red-400'>*</span>
            </label>
            <DashboardSelectBrand
              choosenBrand={ProductDetailState.brand}
              reducerType='CREATE'
              dispatchProductDetailCreate={dispatchProductDetailCreate}
            />
            <FieldError msg={errors.brand} />
          </div>

          <div className='flex-1 min-w-[180px] flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-primaryColor uppercase tracking-wider'>
              Category <span className='text-red-400'>*</span>
            </label>
            <DashboardSelectCategory
              currentCategory={ProductDetailState.category}
              ReducerType='CREATE'
              dispatchProductDetailCreate={dispatchProductDetailCreate}
            />
            <FieldError msg={errors.category} />
          </div>

          {ProductDetailState.category && (
            <div className='flex-1 min-w-[180px] flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-primaryColor uppercase tracking-wider'>
                Sub-Category <span className='text-red-400'>*</span>
              </label>
              <DashboardSelectSubCategory
                dispatchProductDetailCreate={dispatchProductDetailCreate}
                currentCategory={ProductDetailState.category}
                currentSubCategory={ProductDetailState.subCategory}
                ReducerType='CREATE'
              />
              <FieldError msg={errors.subCategory} />
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Section 3 · Content ── */}
      <SectionCard step={3} title='Content'>
        <ProductContentInputs
          description={ProductDetailState.description}
          specifications={ProductDetailState.specifications}
          features={ProductDetailState.features}
          errors={errors}
          onDescriptionChange={(value) => dispatchProductDetailCreate({ type: 'UPDATE_DESCRIPTION', payload: value })}
          onSpecificationsChange={(value) => dispatchProductDetailCreate({ type: 'UPDATE_SPECIFICATIONS', payload: value })}
          onFeaturesChange={(value) => dispatchProductDetailCreate({ type: 'UPDATE_FEATURES', payload: value })}
          onDescriptionErrorClear={() => setErrors(p => ({ ...p, description: '' }))}
        />
      </SectionCard>

      {/* ── Section 4 · Media ── */}
      <SectionCard step={4} title='Product Media'>
        {errors.media && (
          <div className='mb-3 flex items-center gap-2 rounded-lg px-4 py-2.5 border'
            style={{ borderColor: '#f87171', background: 'rgba(248,113,113,0.08)' }}>
            <svg className='w-4 h-4 shrink-0' fill='currentColor' viewBox='0 0 20 20' style={{ color: '#f87171' }}>
              <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
            </svg>
            <p className='text-xs font-semibold' style={{ color: '#f87171' }}>{errors.media}</p>
          </div>
        )}
        <ProductMedia
          productMedias={ProductDetailState.medias}
          dispatchProductDetailCreate={dispatchProductDetailCreate}
          ReducerType='CREATE'
        />
      </SectionCard>

      {/* ── Section 5 · Variants ── */}
      <SectionCard step={5} title='Variants'>
        <DashboardVariantsComponent
          ReduceType='CREATE'
          variantsList={ProductDetailState.variants}
          basePrice={ProductDetailState.basePrice}
          dispatchProductDetailCreate={dispatchProductDetailCreate}
        />
      </SectionCard>

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
  )
}

