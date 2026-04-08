import { ProductDetails } from '@/lib/reducer/productReducer';

export const AddProductValidation = (
    productDetailState: ProductDetails
): { isValid: boolean; errors: Record<string, string> } => {
    const {
        productTitle, basePrice, brand, category,
        subCategory, description, variants, medias
    } = productDetailState;

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
                newErrors.basePrice = 'All variant options must have a non-zero price adjustment when base price is ₱0.';
        }
    }

    const isMediasEmpty = !medias || medias.length === 0;
    if (isMediasEmpty) {
        let hasVariantImage = false;
        if (variants && variants.length > 0) {
            hasVariantImage = variants.some(v =>
                v.variantOptions && v.variantOptions.some(o => !!o.imageUrl)
            );
        }

        if (!hasVariantImage) {
            newErrors.media = 'Upload at least one product image, or add at least one variant image.';
        }
    } else {
        const hasThumb = medias.some(m => m.isMain === true);
        if (!hasThumb)
            newErrors.media = 'Please select a thumbnail image.';
    }

    return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors
    };
}
