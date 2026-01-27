import { useReducer } from 'react';

export interface BrandReduceCreateProps {
  brandName: string;
  imageUrl: File | null;
}

export type BrandActionCreateType =
  | { type: 'BRAND_NAME_CREATE'; payload: string }
  | { type: 'BRAND_IMAGE_CREATE'; payload: File }
  | { type: 'CANCEL_BRAND_CREATE'; payload: BrandReduceProps };


const initialBrandState: BrandReduceProps = {
  brandName: '',
  imageUrl: null,
};


function brandcreatesReducer(
  state: BrandReduceProps,
  action: BrandActionCreateType
): BrandReduceProps {
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


export interface BrandReduceProps {
  brandName: string;
  imageUrl: File | null;
}

export type BrandActionUpdateType =
  | { type: 'BRAND_NAME_UPDATE'; payload: string }
  | { type: 'BRAND_IMAGE_UPDATE'; payload: File }
  | { type: 'CANCEL_BRAND_UPDATE'; payload: BrandReduceProps };



function brandupdateReducer(
  state: BrandReduceProps,
  action: BrandActionUpdateType
): BrandReduceProps {
  switch (action.type) {
    case 'BRAND_NAME_UPDATE':
      return { ...state, brandName: action.payload };
    case 'BRAND_IMAGE_UPDATE':
      return { ...state, imageUrl: action.payload };
    case 'CANCEL_BRAND_UPDATE':
      return { ...action.payload };
    default:
      return state;
  }
}

export function useDashboardBrandUpdateReducer() {
  return useReducer(brandupdateReducer, initialBrandState);
}