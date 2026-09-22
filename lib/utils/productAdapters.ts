import { ProductDetailsEditProps } from '@/types/productTypes';
import { ProductFormState, defaultFormState } from '@/lib/reducer/productFormReducer';

export function mapApiToFormState(apiData: ProductDetailsEditProps): ProductFormState {
    return {
        ...defaultFormState,
        productId: apiData.productId,
        productTitle: apiData.productTitle ?? '',
        basePrice: String(apiData.basePrice ?? ''),
        description: apiData.description ?? '',
        features: apiData.features ?? '',
        specifications: apiData.specifications ?? '',
        brand: apiData.brand ?? null,
        category: apiData.category ?? null,
        subCategory: apiData.subCategory ?? null,
        medias: (apiData.productMedias ?? []).map((m: any) => ({
            id: m.imageId ?? (m.mediaId ? String(m.mediaId) : crypto.randomUUID()),
            url: m.url ?? m.imageUrl ?? m.mediaUrl ?? '',
            file: m.file ?? m.url ?? m.imageUrl ?? m.mediaUrl ?? '',
            isMain: Boolean(m.isMain ?? m.is_main)
        })),
        variants: (apiData.productVariants ?? []).map((v) => ({
            id: v.variantTypeId,
            variantTypeName: v.variantTypeName,
            variantOptions: (v.variantOptions ?? []).map((opt) => ({
                id: opt.variantOptionId,
                variantOptionValue: opt.variantOptionValue,
                price_adjusting: String(opt.variantOptionPrice ?? '0'),
                imageUrl: opt.imageUrl ?? null
            }))
        }))
    };
}