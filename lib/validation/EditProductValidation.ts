import { ProductDetailsEditProps } from "@/types/productTypes";

export const validateEditProduct = (productDetailState: ProductDetailsEditProps) => {
    const { productTitle, basePrice, brand, category, subCategory, description, productMedias, productVariants } = productDetailState;
    const newErrors: Record<string, string> = {};
    const parsePrice = (price: string | undefined | null) => {
        if (price === null || price === undefined || price.trim() === '') return NaN;
        return parseFloat(price.replace(/[^0-9.-]+/g, ''));
    };

    if (!productTitle || !productTitle.trim())
        newErrors.productTitle = 'Product title is required.';
    if (!brand) newErrors.brand = 'Please select a brand.';
    if (!category) newErrors.category = 'Please select a category.';
    if (!subCategory) newErrors.subCategory = 'Please select a sub-category.';
    if (!description || !description.trim())
        newErrors.description = 'Description is required.';

    const parsedBasePrice = parsePrice(basePrice) || 0;
    let hasVariantPricingError = false;


    if (isNaN(parsedBasePrice)) {
        newErrors.basePrice = 'Enter a valid base price.';
    } else {
        if (productVariants && productVariants.length > 0) {
            if (parsedBasePrice === 0) {
                // Invalid if ANY option is ₱0 when base price is ₱0
                const hasZeroPriceOption = productVariants.some((variant) =>
                    variant.variantOptions.some((opt) => {
                        const p = parsePrice(opt.variantOptionPrice);
                        return isNaN(p) || p === 0;
                    })
                );
                if (hasZeroPriceOption) {
                    hasVariantPricingError = true;
                    newErrors.basePrice = 'All variant options must have a price when base price is ₱0.';
                }
            }
        } else if (parsedBasePrice === 0) {
            newErrors.basePrice = 'Base price cannot be ₱0 when there are no variants.';
        }
    }

    // Validate type name and option values
    let hasMissingVariantFields = false;
    if (productVariants) {
        for (const variant of productVariants) {
            if (!variant.variantTypeName || !variant.variantTypeName.trim()) {
                hasMissingVariantFields = true;
            }
            for (const opt of variant.variantOptions) {
                if (!opt.variantOptionValue || !opt.variantOptionValue.trim()) {
                    hasMissingVariantFields = true;
                }
            }
        }
    }
    if (hasMissingVariantFields) {
        newErrors.variants = 'All variant type names and option values are required.';
    }

    // Validate images: either main medias exist or at least one variant option has an image
    const hasMainMedia = productMedias && productMedias.length > 0;
    let hasVariantImage = false;
    if (productVariants) {
        for (const variant of productVariants) {
            for (const opt of variant.variantOptions) {
                if (opt.imageUrl) {
                    hasVariantImage = true;
                    break;
                }
            }
            if (hasVariantImage) break;
        }
    }

    if (!hasMainMedia && !hasVariantImage) {
        newErrors.media = 'Please upload at least one image in the product gallery or variant options.';
    }

    return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors
    };
};
