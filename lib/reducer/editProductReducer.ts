import { ProductDetailsEditProps } from "@/types/productTypes";
import { BrandProps } from "@/types/brandType";
import { Category } from "@/types/categoryType";
import { SubCategory } from "@/types/subCategoryTypes";

export type ProductDetailActionEdit =
    | { type: 'SET_INITIAL_PRODUCT'; payload: ProductDetailsEditProps }
    | { type: 'UPDATE_PRODUCT_TITLE'; payload: string }
    | { type: 'UPDATE_BASE_PRICE'; payload: string }
    | { type: 'UPDATE_DESCRIPTION'; payload: string }
    | { type: 'UPDATE_SPECIFICATION'; payload: string }
    | { type: 'UPDATE_FEATURES'; payload: string }
    | { type: 'UPDATE_BRAND'; payload: BrandProps }
    | { type: 'REMOVE_BRAND' }
    | { type: 'UPDATE_CATEGORY'; payload: Category }
    | { type: 'REMOVE_CATEGORY' }
    | { type: 'UPDATE_SUBCATEGORY'; payload: SubCategory }
    | { type: 'REMOVE_SUBCATEGORY' }
    | { type: 'ADD_MEDIAS_EDIT'; payload: File[] }
    | { type: 'UPDATE_MEDIA_MAIN_EDIT'; payload: number }
    | { type: 'REMOVE_MEDIA'; payload: number }
    | { type: 'UPDATE_PRICE_OPTION'; payload: { variantTypeId: number; variantOptionPrice: string; variantOptionId: number } }
    | { type: 'UPDATE_VARIANT_TYPE'; payload: { variantTypeId: number; variantTypeName: string } }
    | { type: 'REMOVE_VARIANT_TYPE'; payload: { variantTypeId: number } }
    | { type: 'UPDATE_VARIANT_OPTION_NAME'; payload: { variantTypeId: number; variantOptionValue: string; variantOptionId: number } }
    | { type: 'REMOVE_VARIANT_OPTION_NAME'; payload: { variantTypeId: number; variantOptionId: number } }
    | { type: 'UPDATE_VARIANT_IMAGE'; payload: { variantTypeId: number; variantOptionId: number; imageFile: File } }
    | { type: 'REMOVE_VARIANT_IMAGE'; payload: { variantTypeId: number; variantOptionId: number } }

export const initialProductDetailState: ProductDetailsEditProps = {
    productId: 0,
    productTitle: '',
    basePrice: '',
    description: null,
    features: null,
    specifications: null,
    brand: null,
    category: { categoryName: '', categoryId: 0 },
    subCategory: { subCategoryId: 0, subCategoryName: '' },
    productVariants: [],
    productMedias: [],
};

export function ProductDetailEditReducer(
    state: ProductDetailsEditProps,
    action: ProductDetailActionEdit
): ProductDetailsEditProps {
    switch (action.type) {
        case 'SET_INITIAL_PRODUCT':
            return {
                ...action.payload,
                productVariants: action.payload.productVariants ?? [],
                productMedias: action.payload.productMedias ?? [],
            };
        case 'UPDATE_PRODUCT_TITLE':
            return { ...state, productTitle: action.payload };
        case 'UPDATE_BASE_PRICE':
            return { ...state, basePrice: String(Number(action.payload).toFixed(2)) };
        case 'UPDATE_DESCRIPTION':
            return { ...state, description: action.payload };
        case 'UPDATE_SPECIFICATION':
            return { ...state, specifications: action.payload };
        case 'UPDATE_FEATURES':
            return { ...state, features: action.payload };
        case 'UPDATE_BRAND':
            return { ...state, brand: action.payload };
        case 'REMOVE_BRAND':
            return { ...state, brand: null };
        case 'UPDATE_CATEGORY':
            return { ...state, category: action.payload };
        case 'REMOVE_CATEGORY':
            return { ...state, category: null };
        case 'UPDATE_SUBCATEGORY':
            return { ...state, subCategory: action.payload };
        case 'REMOVE_SUBCATEGORY':
            return { ...state, subCategory: null };
        case 'UPDATE_PRICE_OPTION': {
            const updated = state.productVariants.map((variant) => {
                if (variant.variantTypeId !== action.payload.variantTypeId) return variant;
                return {
                    ...variant,
                    variantOptions: variant.variantOptions.map((opt) =>
                        opt.variantOptionId === action.payload.variantOptionId
                            ? { ...opt, variantOptionPrice: String(Number(action.payload.variantOptionPrice).toFixed(2)) }
                            : opt
                    ),
                };
            });
            return { ...state, productVariants: updated };
        }
        case 'UPDATE_VARIANT_TYPE': {
            const updated = state.productVariants.map((v) =>
                v.variantTypeId === action.payload.variantTypeId
                    ? { ...v, variantTypeName: action.payload.variantTypeName }
                    : v
            );
            return { ...state, productVariants: updated };
        }
        case 'UPDATE_VARIANT_OPTION_NAME': {
            const updated = state.productVariants.map((variant) => {
                if (variant.variantTypeId !== action.payload.variantTypeId) return variant;
                return {
                    ...variant,
                    variantOptions: variant.variantOptions.map((opt) =>
                        opt.variantOptionId === action.payload.variantOptionId
                            ? { ...opt, variantOptionValue: action.payload.variantOptionValue }
                            : opt
                    ),
                };
            });
            return { ...state, productVariants: updated };
        }
        case 'REMOVE_VARIANT_OPTION_NAME': {
            const updated = state.productVariants.map((variant) => {
                if (variant.variantTypeId !== action.payload.variantTypeId) return variant;
                return {
                    ...variant,
                    variantOptions: variant.variantOptions.filter((opt) => opt.variantOptionId !== action.payload.variantOptionId),
                };
            });
            return { ...state, productVariants: updated };
        }
        case 'REMOVE_VARIANT_TYPE': {
            const updated = state.productVariants.filter((v) => v.variantTypeId !== action.payload.variantTypeId);
            return { ...state, productVariants: updated };
        }
        case 'UPDATE_VARIANT_IMAGE': {
            const updated = state.productVariants.map((variant) => {
                if (variant.variantTypeId !== action.payload.variantTypeId) return variant;
                return {
                    ...variant,
                    variantOptions: variant.variantOptions.map((opt) =>
                        opt.variantOptionId === action.payload.variantOptionId
                            ? { ...opt, imageUrl: action.payload.imageFile }
                            : opt
                    ),
                };
            });
            return { ...state, productVariants: updated };
        }
        case 'REMOVE_VARIANT_IMAGE': {
            const updated = state.productVariants.map((variant) => {
                if (variant.variantTypeId !== action.payload.variantTypeId) return variant;
                return {
                    ...variant,
                    variantOptions: variant.variantOptions.map((opt) =>
                        opt.variantOptionId === action.payload.variantOptionId
                            ? { ...opt, imageUrl: null }
                            : opt
                    ),
                };
            });
            return { ...state, productVariants: updated };
        }
        case 'ADD_MEDIAS_EDIT': {
            const newMedias = action.payload.map((file, i) => ({
                file: file,
                isMain: (state.productMedias?.length === 0 && i === 0) ? true : false,
                imageId: Date.now() + i
            }));
            return {
                ...state,
                productMedias: [...(state.productMedias || []), ...newMedias]
            };
        }
        case 'REMOVE_MEDIA': {
            if (!state.productMedias) return state;
            const filtered = state.productMedias.filter((m) => m.imageId !== action.payload);
            return { ...state, productMedias: filtered.length ? filtered : null };
        }
        case 'UPDATE_MEDIA_MAIN_EDIT': {
            if (!state.productMedias) return state;
            const updatedMedias = state.productMedias.map((media) => ({
                ...media,
                isMain: media.imageId === action.payload,
            }));
            return {
                ...state,
                productMedias: updatedMedias,
            };
        }
        default:
            return state;
    }
}
