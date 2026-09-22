export interface ProductValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

const parsePrice = (price: unknown): number => {
    if (price === undefined || price === null || price === '') return 0;
    if (typeof price === 'number') return price;
    const parsed = parseFloat(String(price).replace(/[^0-9.-]+/g, ''));
    return isNaN(parsed) ? 0 : parsed;
};

const parseInteger = (val: unknown): number => {
    if (val === undefined || val === null || val === '') return NaN;
    if (typeof val === 'number') return Math.floor(val);
    const parsed = parseInt(String(val).replace(/[^0-9.-]+/g, ''), 10);
    return parsed;
};

export const validateProduct = (
    productDetailState: Record<string, any>
): ProductValidationResult => {
    console.log(productDetailState);

    const state = productDetailState || {};
    const errors: Record<string, string> = {};

    // 1. RESOLVE ACTIVE ARRAYS WITH FALLBACKS
    const activeMedias = state.medias?.length ? state.medias : (state.productMedias || []);
    const activeVariants = state.variants?.length ? state.variants : (state.productVariants || []);
    const activeMatrix =
        state.variant_matrix?.length ? state.variant_matrix :
            state.variantMatrixRows?.length ? state.variantMatrixRows :
                (state.variantMatrix || []);

    // 2. CORE BASELINE VALIDATION
    if (!state.productTitle || typeof state.productTitle !== 'string' || !state.productTitle.trim()) {
        errors.productTitle = 'Product title is required and must contain text.';
    }

    if (!state.description || typeof state.description !== 'string' || !state.description.trim()) {
        errors.description = 'Description is required and must contain text.';
    }

    const { brand, category, subCategory } = state;

    if (!brand || typeof brand !== 'object' || (!brand.id && !brand.brandId && !brand.brandName)) {
        errors.brand = 'Brand selection is required.';
    }

    if (!category || typeof category !== 'object' || (!category.id && !category.categoryId && !category.categoryName)) {
        errors.category = 'Category selection is required.';
    }

    if (!subCategory || typeof subCategory !== 'object' || (!subCategory.id && !subCategory.subCategoryId && !subCategory.subCategoryName)) {
        errors.subCategory = 'Sub-category selection is required.';
    }

    const parsedBasePrice = parsePrice(state.basePrice);

    // 3. PRODUCT TYPE VALIDATION (SIMPLE VS VARIANT)
    if (activeVariants.length === 0) {
        if (parsedBasePrice <= 0) {
            errors.basePrice = 'Base price must be greater than ₱0.00 for simple products.';
        }

        const effectiveSku = state.masterSku || state.sku;
        if (!effectiveSku || typeof effectiveSku !== 'string' || !effectiveSku.trim()) {
            errors.masterSku = 'Master SKU is required for simple products and cannot be blank.';
        }

        const effectiveStock = state.initialStock !== undefined ? state.initialStock : state.stockQuantity;
        const parsedStock = parseInteger(effectiveStock);
        if (isNaN(parsedStock) || parsedStock < 0) {
            errors.initialStock = 'Initial stock must be an integer equal to or greater than 0.';
        }
    } else {
        // Variant Structure Checks
        activeVariants.forEach((v: any, vIdx: number) => {
            if (!v?.variantTypeName || typeof v.variantTypeName !== 'string' || !v.variantTypeName.trim()) {
                errors[`variantType_${vIdx}`] = 'Variant type name cannot be blank.';
            }
            if (!v?.variantOptions || !Array.isArray(v.variantOptions) || v.variantOptions.length === 0) {
                errors[`variantOptions_${vIdx}`] = 'At least one option pill value is required for this variant type.';
            }
        });

        if (!Array.isArray(activeMatrix) || activeMatrix.length === 0) {
            errors.matrix = 'Variant matrix cannot be empty when variations are active.';
        } else {
            // Strict Variant Matrix Row Checks
            activeMatrix.forEach((row: any, rIdx: number) => {
                if (!row || typeof row !== 'object') {
                    errors[`matrixRow_${rIdx}`] = 'Invalid variant matrix row combination.';
                    return;
                }

                const rowSku = row.sku_code || row.skuCode;
                if (!rowSku || typeof rowSku !== 'string' || !rowSku.trim()) {
                    errors[`matrixSku_${rIdx}`] = 'SKU code is required for this variation.';
                }

                const rowStock = parseInteger(row.stock_quantity ?? row.stockQuantity);
                if (isNaN(rowStock) || rowStock < 0) {
                    errors[`matrixStock_${rIdx}`] = 'Stock quantity must be an integer equal to or greater than 0.';
                }

                // Check pricing for EACH individual matrix row
                const rowPrice = parsePrice(row.checkout_price ?? row.price ?? state.basePrice);
                if (rowPrice <= 0) {
                    errors[`matrixPrice_${rIdx}`] = 'Every variant row must have a checkout price greater than ₱0.00.';
                }
            });
        }
    }

    // 4. MEDIA VALIDATION
    const hasGlobalMedia = Array.isArray(activeMedias) && activeMedias.some((m: any) => {
        if (!m) return false;
        return !!(m.file || m.url || m.imageUrl || (typeof m === 'string' && m.trim() !== ''));
    });

    let hasVariantMedia = false;

    if (Array.isArray(activeVariants) && activeVariants.length > 0) {
        hasVariantMedia = activeVariants.some((v: any) =>
            Array.isArray(v?.variantOptions) && v.variantOptions.some((opt: any) => {
                if (!opt) return false;
                return !!(opt.imageUrl || opt.file || (typeof opt.imageUrl === 'string' && opt.imageUrl.trim() !== ''));
            })
        );
    }

    if (!hasVariantMedia && Array.isArray(activeMatrix) && activeMatrix.length > 0) {
        hasVariantMedia = activeMatrix.some((row: any) => {
            if (!row) return false;
            return !!(row.imageUrl || row.file || (typeof row.imageUrl === 'string' && row.imageUrl.trim() !== ''));
        });
    }

    // Ensure at least ONE image exists globally OR on variants
    if (!hasGlobalMedia && !hasVariantMedia) {
        errors.media = 'Either a global product media gallery image or variant option images must be provided.';
    }

    // Main image check: Flexible truthy evaluation for `isMain`
    if (hasGlobalMedia) {
        const mainImagesCount = activeMedias.filter((m: any) => m && (m.isMain === true || m.isMain === 1 || m.isMain === 'true')).length;
        if (mainImagesCount !== 1) {
            errors.media = 'Exactly one media item must be designated as the primary display image.';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};