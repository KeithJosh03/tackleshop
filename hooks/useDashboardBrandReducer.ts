import { useReducer } from 'react';

export interface BrandReduceCreateProps {
  brandName: string;
  imageUrl: File | null;
}

export type BrandActionCreateType =
  | { type: 'BRAND_NAME_CREATE'; payload: string }
  | { type: 'BRAND_IMAGE_CREATE'; payload: File }
  | { type: 'CANCEL_BRAND_CREATE'; payload: BrandReduceCreateProps };


const initialBrandState: BrandReduceCreateProps = {
  brandName: '',
  imageUrl: null,
};


function brandcreatesReducer(
  state: BrandReduceCreateProps,
  action: BrandActionCreateType
): BrandReduceCreateProps {
  switch (action.type) {
    case 'BRAND_NAME_CREATE':
      return { ...state, brandName: action.payload };
    case 'BRAND_IMAGE_CREATE':
      return { ...state, imageUrl: action.payload };
    case 'CANCEL_BRAND_CREATE':
      return { ...action.payload };
    default:
      return state;
  }
}



export function useDashboardBrandCreateReducer() {
  return useReducer(brandcreatesReducer, initialBrandState);
}


export interface BrandReduceEditProps {
  brandName: string;
  imageUrl: string | File | null;
}

export type BrandActionUpdateType =
  | { type: 'BRAND_NAME_UPDATE'; payload: string }
  | { type: 'BRAND_IMAGE_UPDATE'; payload: File }
  | { type: 'CANCEL_BRAND_UPDATE'; payload: BrandReduceEditProps }
  | { type: 'SET_BRAND_UPDATE'; payload: {brandName: string , imageUrl: string | null} }


const brandEditState: BrandReduceEditProps = {
  brandName: '',
  imageUrl: null,
};


function brandupdateReducer(
  state: BrandReduceEditProps,
  action: BrandActionUpdateType
): BrandReduceEditProps {
  switch (action.type) {
    case 'BRAND_NAME_UPDATE':
      return { ...state, brandName: action.payload };
    case 'BRAND_IMAGE_UPDATE':
      return { ...state, imageUrl: action.payload };
    case 'CANCEL_BRAND_UPDATE':
      return { ...action.payload };
    case 'SET_BRAND_UPDATE' : 
      console.log(action.payload)
      return {...action.payload}
    default:
      return state;
  }
}

export function useDashboardBrandUpdateReducer() {
  return useReducer(brandupdateReducer, brandEditState);
}