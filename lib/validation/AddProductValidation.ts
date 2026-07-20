import { ProductDetails } from '@/lib/reducer/productReducer';

export const AddProductValidation = (
    productDetailState: any // Using any or your ProductDetails variant matrix extension
): { isValid: boolean; errors: Record<string, string> } => {
    const {
        productTitle,
        basePrice,
        brand,
        category,
        subCategory,
        description,
        masterSku,
        initialStock,
        variants,
        variant_matrix, // 🚨 CRITICAL: Extract your generated matrix table rows
        medias
    } = productDetailState;

    const newErrors: Record<string, string> = {};

    // 1. Bulletproof Price Parsing Utility
    const parsePrice = (price: any) => {
        if (price === undefined || price === null || price === '') return 0; // Default to 0 instead of NaN
        if (typeof price === 'number') return price;
        const parsed = parseFloat(String(price).replace(/[^0-9.-]+/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    };

    // 2. Core Baseline Fields Validation
    if (!productTitle || !productTitle.trim()) {
        newErrors.productTitle = 'Product title is required.';
    }
    if (!brand) {
        newErrors.brand = 'Please select a brand.';
    }
    if (!category) {
        newErrors.category = 'Please select a category.';
    }
    if (!subCategory) {
        newErrors.subCategory = 'Please select a sub-category.';
    }
    if (!description || !description.trim()) {
        newErrors.description = 'Description is required.';
    }

    // 3. Dynamic Workflow Branch Validation
    const parsedBasePrice = parsePrice(basePrice);
    const hasVariants = variants && variants.length > 0;

    if (!hasVariants) {
        // A) BRANCH 1: SIMPLE PRODUCT
        if (parsedBasePrice <= 0) {
            newErrors.basePrice = 'Base price must be greater than ₱0 for products without variations.';
        }

        if (!masterSku || !masterSku.trim()) {
            newErrors.masterSku = 'Master SKU code is required for simple products.';
        }

        const parsedInitialStock = parseInt(String(initialStock || '').replace(/[^0-9.-]+/g, ''), 10);
        if (isNaN(parsedInitialStock) || parsedInitialStock < 0) {
            newErrors.initialStock = 'Initial stock must be a valid number equal to or greater than 0.';
        }
    } else {
        // B) BRANCH 2: COMPLEX PRODUCT MATRIX (Variations Active)
        if (parsedBasePrice < 0) {
            newErrors.basePrice = 'Enter a valid base price.';
        }

        // Validate the structure definitions
        variants.forEach((v: any, vIdx: number) => {
            if (!v.variantTypeName || !v.variantTypeName.trim()) {
                newErrors[`variantType_${vIdx}`] = 'Attribute group name cannot be blank.';
            }
            if (!v.variantOptions || v.variantOptions.length === 0) {
                newErrors[`variantOptions_${vIdx}`] = `At least one option pill is required.`;
            }
        });

        // 🚨 FIX: Target the actual Matrix rows panel (Revros LT 1000 S, etc.)
        if (!variant_matrix || variant_matrix.length === 0) {
            newErrors.matrix = 'Variant matrix grid combinations have not been generated.';
        } else {
            let matrixHasValidPrice = false;

            variant_matrix.forEach((row: any, rIdx: number) => {
                // Read from your explicit row pricing fields (checkout_price or price)
                const rowPrice = parsePrice(row.checkout_price || row.price);
                const rowStock = parseInt(String(row.stock_quantity || row.variant_stock_qty || ''), 10);

                if (rowPrice < 0) {
                    newErrors[`matrixPrice_${rIdx}`] = 'Price cannot be negative.';
                }
                if (isNaN(rowStock) || rowStock < 0) {
                    newErrors[`matrixStock_${rIdx}`] = 'Stock must be 0 or greater.';
                }
                if (!row.sku_code && !row.sku) {
                    newErrors[`matrixSku_${rIdx}`] = 'Unique row SKU is required.';
                }

                // If any variation row has a value, it's valid
                if (rowPrice > 0) {
                    matrixHasValidPrice = true;
                }
            });

            // If global base price is 0, make sure variation values aren't all 0
            if (parsedBasePrice === 0 && !matrixHasValidPrice) {
                newErrors.basePrice = 'When base price is ₱0, at least one matrix variant combination row must have a price greater than ₱0.';
            }
        }
    }

    // 4. Media Cover Guardrails
    const isMediasEmpty = !medias || medias.length === 0;
    if (isMediasEmpty) {
        let hasVariantImage = false;
        if (variant_matrix && variant_matrix.length > 0) {
            hasVariantImage = variant_matrix.some((row: any) => !!row.image_url || !!row.imageUrl);
        }

        if (!hasVariantImage) {
            newErrors.media = 'Upload at least one global product image, or assign a photo to a variant row option.';
        }
    } else {
        const hasThumb = medias.some((m: any) => m.isMain === true);
        if (!hasThumb) {
            newErrors.media = 'Please designate exactly one image as the main cover thumbnail.';
        }
    }

    return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors
    };
};