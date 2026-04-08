import { BrandProps } from '@/types/brandType';
import { Category } from '@/types/categoryType';
import { SubCategory } from '@/types/subCategoryTypes';

export interface VariantDetails {
    variantTypeName: string;
    variantOptions: VariantOption[];
}

export interface VariantOption {
    variantOptionValue: string;
    price_adjusting: string;
    imageUrl: File | null;
}

export interface ProductImage {
    file: File;
    isMain: boolean;
}

export interface ProductDetails {
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
    | { type: 'REMOVE_VARIANT_TYPE'; payload: { variantIndex: number } }
    | { type: 'REMOVE_VARIANT_OPTION'; payload: { variantIndex: number; optionIndex: number } }
    | { type: 'UPDATE_VARIANT_TYPE_NAME'; payload: { variantIndex: number; variantTypeName: string } }
    | { type: 'UPDATE_VARIANT_OPTION_NAME'; payload: { variantIndex: number; optionIndex: number; variantOptionValue: string } }



export function ProductDetailCreateReducer(
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
                            return { ...option, imageUrl: action.payload.variantImage };
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
                            return { ...option, imageUrl: null };
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
        case 'REMOVE_VARIANT_TYPE': {
            return {
                ...state,
                variants: state.variants.filter((_, i) => i !== action.payload.variantIndex),
            };
        }
        case 'REMOVE_VARIANT_OPTION': {
            const updatedVariants = state.variants.map((variant, vi) => {
                if (vi !== action.payload.variantIndex) return variant;
                return {
                    ...variant,
                    variantOptions: variant.variantOptions.filter((_, oi) => oi !== action.payload.optionIndex),
                };
            });
            return { ...state, variants: updatedVariants };
        }
        case 'UPDATE_VARIANT_TYPE_NAME': {
            const updatedVariants = state.variants.map((v, i) => {
                if (i !== action.payload.variantIndex) return v;
                return { ...v, variantTypeName: action.payload.variantTypeName };
            });
            return { ...state, variants: updatedVariants };
        }
        case 'UPDATE_VARIANT_OPTION_NAME': {
            const updatedVariants = state.variants.map((v, vi) => {
                if (vi !== action.payload.variantIndex) return v;
                const updatedOptions = v.variantOptions.map((o, oi) => {
                    if (oi !== action.payload.optionIndex) return o;
                    return { ...o, variantOptionValue: action.payload.variantOptionValue };
                });
                return { ...v, variantOptions: updatedOptions };
            });
            return { ...state, variants: updatedVariants };
        }
        default:
            return state;
    }
}
