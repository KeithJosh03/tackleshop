import { BrandProps } from '@/types/brandType';
import { CategoryProps } from '@/types/categoryType';
import { SubCategory } from '@/types/subCategoryTypes';

export interface FormVariantOption {
    id: string | number; // Local UUID for new items, DB ID for edits
    variantOptionValue: string;
    price_adjusting: string;
    imageUrl: File | string | null;
}

export interface FormVariantType {
    id: string | number; // Local UUID for new items, DB ID for edits
    variantTypeName: string;
    variantOptions: FormVariantOption[];
}

export interface FormMedia {
    id: string | number;
    file?: File | string;
    url?: string;
    isMain: boolean;
}

export interface ProductFormState {
    productId?: number | string;
    productTitle: string;
    basePrice: string;
    description: string | null;
    features: string | null;
    specifications: string | null;
    brand: BrandProps | null;
    category: CategoryProps | null;
    subCategory: SubCategory | null;
    variants: FormVariantType[];
    medias: FormMedia[];
    masterSku: string;
    initialStock: string;
    hasVariations: boolean;
}

export type ProductFormAction =
    | { type: 'SET_FORM_STATE'; payload: ProductFormState }
    | { type: 'CLEAR_VARIANTS' }
    | { type: 'UPDATE_TITLE'; payload: string }
    | { type: 'UPDATE_BASE_PRICE'; payload: string }
    | { type: 'UPDATE_DESCRIPTION'; payload: string | null }
    | { type: 'UPDATE_FEATURES'; payload: string | null }
    | { type: 'UPDATE_SPECIFICATIONS'; payload: string | null }
    | { type: 'UPDATE_MASTER_SKU'; payload: string }
    | { type: 'UPDATE_INITIAL_STOCK'; payload: string }
    | { type: 'TOGGLE_HAS_VARIATIONS'; payload: boolean }
    | { type: 'SET_BRAND'; payload: BrandProps | null }
    | { type: 'SET_CATEGORY'; payload: CategoryProps | null }
    | { type: 'SET_SUBCATEGORY'; payload: SubCategory | null }
    | { type: 'ADD_MEDIAS'; payload: FormMedia[] }
    | { type: 'REMOVE_MEDIA'; payload: string | number }
    | { type: 'SET_MAIN_MEDIA'; payload: string | number }
    | { type: 'ADD_VARIANT_TYPE'; payload: FormVariantType }
    | { type: 'REMOVE_VARIANT_TYPE'; payload: string | number }
    | { type: 'UPDATE_VARIANT_TYPE_NAME'; payload: { typeId: string | number; name: string } }
    | { type: 'ADD_VARIANT_OPTION'; payload: { typeId: string | number; option: FormVariantOption } }
    | { type: 'REMOVE_VARIANT_OPTION'; payload: { typeId: string | number; optionId: string | number } }
    | { type: 'UPDATE_VARIANT_OPTION'; payload: { typeId: string | number; optionId: string | number; fields: Partial<FormVariantOption> } }
    | { type: 'UPDATE_VARIANT_OPTION_BY_ID'; payload: { optionId: string | number; fields: Partial<FormVariantOption> } };

export const defaultFormState: ProductFormState = {
    productTitle: '',
    basePrice: '',
    description: null,
    features: null,
    specifications: null,
    brand: null,
    category: null,
    subCategory: null,
    variants: [],
    medias: [],
    masterSku: '',
    initialStock: '',
    hasVariations: false
};

export function productFormReducer(state: ProductFormState, action: ProductFormAction): ProductFormState {
    switch (action.type) {
        case 'SET_FORM_STATE':
            return { ...action.payload };

        case 'CLEAR_VARIANTS':
            return { ...state, variants: [] };

        case 'UPDATE_TITLE':
            return { ...state, productTitle: action.payload };

        case 'UPDATE_BASE_PRICE':
            return { ...state, basePrice: action.payload };

        case 'UPDATE_DESCRIPTION':
            return { ...state, description: action.payload };

        case 'UPDATE_FEATURES':
            return { ...state, features: action.payload };

        case 'UPDATE_SPECIFICATIONS':
            return { ...state, specifications: action.payload };

        case 'UPDATE_MASTER_SKU':
            return { ...state, masterSku: action.payload };

        case 'UPDATE_INITIAL_STOCK':
            return { ...state, initialStock: action.payload };

        case 'TOGGLE_HAS_VARIATIONS':
            return {
                ...state,
                hasVariations: action.payload
            };

        case 'SET_BRAND':
            return { ...state, brand: action.payload };

        case 'SET_CATEGORY':
            return { ...state, category: action.payload, subCategory: null };

        case 'SET_SUBCATEGORY':
            return { ...state, subCategory: action.payload };

        case 'ADD_MEDIAS': {
            const current = state.medias ?? [];
            const hasMain = current.some((m) => m.isMain);
            const incoming = action.payload.map((m, idx) => ({
                ...m,
                isMain: !hasMain && idx === 0 ? true : m.isMain
            }));
            return { ...state, medias: [...current, ...incoming] };
        }

        case 'REMOVE_MEDIA': {
            const remaining = state.medias.filter((m) => m.id !== action.payload);
            if (remaining.length > 0 && !remaining.some((m) => m.isMain)) {
                remaining[0] = { ...remaining[0], isMain: true };
            }
            return { ...state, medias: remaining };
        }

        case 'SET_MAIN_MEDIA':
            return {
                ...state,
                medias: state.medias.map((m) => ({ ...m, isMain: m.id === action.payload }))
            };

        case 'ADD_VARIANT_TYPE':
            return { ...state, variants: [...state.variants, action.payload] };

        case 'REMOVE_VARIANT_TYPE':
            return { ...state, variants: state.variants.filter((v) => v.id !== action.payload) };

        case 'UPDATE_VARIANT_TYPE_NAME':
            return {
                ...state,
                variants: state.variants.map((v) =>
                    v.id === action.payload.typeId ? { ...v, variantTypeName: action.payload.name } : v
                )
            };

        case 'ADD_VARIANT_OPTION':
            return {
                ...state,
                variants: state.variants.map((v) => {
                    if (v.id !== action.payload.typeId) return v;
                    const exists = v.variantOptions.some(
                        (o) => o.variantOptionValue.toLowerCase() === action.payload.option.variantOptionValue.toLowerCase()
                    );
                    if (exists) return v;
                    return { ...v, variantOptions: [...v.variantOptions, action.payload.option] };
                })
            };

        case 'REMOVE_VARIANT_OPTION':
            return {
                ...state,
                variants: state.variants.map((v) =>
                    v.id === action.payload.typeId
                        ? { ...v, variantOptions: v.variantOptions.filter((o) => o.id !== action.payload.optionId) }
                        : v
                )
            };

        case 'UPDATE_VARIANT_OPTION':
            return {
                ...state,
                variants: state.variants.map((v) => {
                    if (v.id !== action.payload.typeId) return v;
                    return {
                        ...v,
                        variantOptions: v.variantOptions.map((o) =>
                            o.id === action.payload.optionId ? { ...o, ...action.payload.fields } : o
                        )
                    };
                })
            };

        case 'UPDATE_VARIANT_OPTION_BY_ID':
            return {
                ...state,
                variants: state.variants.map((v) => ({
                    ...v,
                    variantOptions: v.variantOptions.map((o) =>
                        o.id === action.payload.optionId ? { ...o, ...action.payload.fields } : o
                    )
                }))
            };

        default:
            return state;
    }
}