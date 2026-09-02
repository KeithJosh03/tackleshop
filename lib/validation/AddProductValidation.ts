export interface ProductValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export const AddProductValidation = (
    productDetailState: any
): ProductValidationResult => {
    const {
        productTitle,
        description,
        brand,
        category,
        subCategory,
        basePrice,
        masterSku,
        initialStock,
        variants = [],
        variant_matrix = [],
        medias = []
    } = productDetailState || {};

    const errors: Record<string, string> = {};

    // Utility: Parse price strictly to numeric decimal
    const parsePrice = (price: any): number => {
        if (price === undefined || price === null || price === '') return 0;
        if (typeof price === 'number') return price;
        const parsed = parseFloat(String(price).replace(/[^0-9.-]+/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    };

    // Utility: Parse integer for stock
    const parseInteger = (val: any): number => {
        if (val === undefined || val === null || val === '') return NaN;
        if (typeof val === 'number') return Math.floor(val);
        const parsed = parseInt(String(val).replace(/[^0-9.-]+/g, ''), 10);
        return parsed;
    };

    // 1. CORE BASELINE VALIDATION (Applies to all products)
    if (!productTitle || typeof productTitle !== 'string' || !productTitle.trim()) {
        errors.productTitle = 'Product title is required and must contain text.';
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
        errors.description = 'Description is required and must contain text.';
    }

    if (!brand || typeof brand !== 'object') {
        errors.brand = 'Brand selection is required.';
    }

    if (!category || typeof category !== 'object') {
        errors.category = 'Category selection is required.';
    }

    if (!subCategory || typeof subCategory !== 'object') {
        errors.subCategory = 'Sub-category selection is required.';
    }

    // Specifications and features are nullable and require no strict type-check here.

    const parsedBasePrice = parsePrice(basePrice);

    // 2. & 3. CONDITIONAL BRANCHING
    if (variants.length === 0) {
        // CONDITIONAL BRANCH A: SIMPLE PRODUCT
        if (parsedBasePrice <= 0) {
            errors.basePrice = 'Base price must be greater than ₱0.00 for simple products.';
        }

        if (!masterSku || typeof masterSku !== 'string' || !masterSku.trim()) {
            errors.masterSku = 'Master SKU is required for simple products and cannot be blank.';
        }

        const parsedStock = parseInteger(initialStock);
        if (isNaN(parsedStock) || parsedStock < 0) {
            errors.initialStock = 'Initial stock must be an integer equal to or greater than 0.';
        }
    } else {
        // CONDITIONAL BRANCH B: VARIANT MATRIX PRODUCT

        // Attribute Hierarchy Structure Validation
        variants.forEach((v: any, vIdx: number) => {
            if (!v.variantTypeName || typeof v.variantTypeName !== 'string' || !v.variantTypeName.trim()) {
                errors[`variantType_${vIdx}`] = 'Variant type name cannot be blank.';
            }
            if (!v.variantOptions || !Array.isArray(v.variantOptions) || v.variantOptions.length === 0) {
                errors[`variantOptions_${vIdx}`] = 'At least one option pill value is required for this variant type.';
            }
        });

        // Real-Time Table Matrix Validation
        if (!Array.isArray(variant_matrix) || variant_matrix.length === 0) {
            errors.matrix = 'Variant matrix cannot be empty when variations are active.';
        } else {
            let hasPositiveMatrixPrice = false;

            variant_matrix.forEach((row: any, rIdx: number) => {
                // a) Variant Option Value/Name is present (checking generic object existence implies this row object exists)
                if (!row || typeof row !== 'object') {
                    errors[`matrixRow_${rIdx}`] = 'Invalid variant matrix row combination.';
                } else {
                    // b) sku_code is Not Nullable and non-blank
                    if (!row.sku_code || typeof row.sku_code !== 'string' || !row.sku_code.trim()) {
                        errors[`matrixSku_${rIdx}`] = 'SKU code is required and cannot be blank for this combination.';
                    }

                    // c) stock_quantity is Not Nullable and an integer >= 0
                    const rowStock = parseInteger(row.stock_quantity);
                    if (isNaN(rowStock) || rowStock < 0) {
                        errors[`matrixStock_${rIdx}`] = 'Stock quantity must be an integer equal to or greater than 0.';
                    }

                    const rowPrice = parsePrice(row.checkout_price);
                    if (rowPrice > 0) {
                        hasPositiveMatrixPrice = true;
                    } else if (rowPrice < 0) {
                        errors[`matrixPrice_${rIdx}`] = 'Checkout price cannot be negative.';
                    }
                }
            });

            // Complex Multi-Level Pricing Logic Constraints
            if (parsedBasePrice === 0) {
                // Rule 1: If basePrice is 0, at least one row must have checkout price > 0.
                // Rule 3: Fail validation completely if both are 0 (preventing free checkouts).
                if (!hasPositiveMatrixPrice) {
                    errors.basePrice = 'Base price is ₱0.00; at least one variant matrix row must have a checkout price greater than ₱0.00.';
                    errors.matrixPricing = 'Cannot have both base price and all matrix checkout prices as ₱0.00 (free checkout is not permitted).';
                }
            }
            // Rule 2: If basePrice > 0, individual matrix rows are permitted to have a checkout price offset value of 0. (Implicitly valid)
        }
    }

    // 4. ADVANCED MEDIA COEXISTENCE GUARDRAIL
    const hasGlobalMedia = Array.isArray(medias) && medias.length > 0;

    let hasVariantMedia = false;
    if (Array.isArray(variant_matrix) && variant_matrix.length > 0) {
        hasVariantMedia = variant_matrix.some((row: any) =>
            !!row.imageUrl
        );
    }

    // Rule 3: Fail validation if BOTH global medias and individual variant images are empty/null.
    if (!hasGlobalMedia && !hasVariantMedia) {
        errors.media = 'Either a global product media gallery image or variant option images must be provided.';
    }

    // Rule 1 & Rule 2 are implicitly satisfied if Rule 3 passes.

    // Rule 4: If global media gallery items are used, exactly one item must be designated as the primary display (isMain: true).
    if (hasGlobalMedia) {
        const mainImagesCount = medias.filter((m: any) => m.isMain === true).length;
        if (mainImagesCount !== 1) {
            errors.media = 'Exactly one media item must be designated as the primary display (isMain: true).';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};