import { ProductDetailsEditProps } from "@/types/productTypes";

export const getModifiedFields = (
    initial: ProductDetailsEditProps,
    current: ProductDetailsEditProps
): Partial<ProductDetailsEditProps> => {
    const changed: Partial<ProductDetailsEditProps> = {};

    if (current.productTitle !== initial.productTitle) changed.productTitle = current.productTitle;
    if (current.basePrice !== initial.basePrice) changed.basePrice = current.basePrice;
    if (current.description !== initial.description) changed.description = current.description;
    if (current.features !== initial.features) changed.features = current.features;
    if (current.specifications !== initial.specifications) changed.specifications = current.specifications;

    const getBrandId = (b: any) => b?.brandId || null;
    if (getBrandId(current.brand) !== getBrandId(initial.brand)) changed.brand = current.brand;

    const getCategoryId = (c: any) => c?.categoryId || null;
    if (getCategoryId(current.category) !== getCategoryId(initial.category)) changed.category = current.category;

    const getSubId = (s: any) => s?.subCategoryId || null;
    if (getSubId(current.subCategory) !== getSubId(initial.subCategory)) changed.subCategory = current.subCategory;

    // Diffing Product Medias
    if (current.productMedias !== initial.productMedias) {
        const mediasDiff: any[] = [];
        const currentMedias = current.productMedias || [];
        const initialMedias = initial.productMedias || [];

        currentMedias.forEach(currentMedia => {
            const initialMedia = initialMedias.find(m => m.imageId === currentMedia.imageId && currentMedia.imageId !== undefined);
            if (!initialMedia) {
                // New media
                mediasDiff.push(currentMedia);
            } else {
                const mediaChanges: any = {};
                let hasChanges = false;

                if (currentMedia.imageUrl !== initialMedia.imageUrl) {
                    mediaChanges.imageUrl = currentMedia.imageUrl;
                    hasChanges = true;
                }
                if (currentMedia.isMain !== initialMedia.isMain) {
                    mediaChanges.isMain = currentMedia.isMain;
                    hasChanges = true;
                }
                if (currentMedia.file !== initialMedia.file) {
                    mediaChanges.file = currentMedia.file;
                    hasChanges = true;
                }

                if (hasChanges) {
                    mediasDiff.push({ ...mediaChanges, imageId: currentMedia.imageId });
                } else {
                    // Include unmodified media by its ID so the backend doesn't delete it on sync
                    mediasDiff.push({ imageId: currentMedia.imageId });
                }
            }
        });

        if (mediasDiff.length > 0 || currentMedias.length !== initialMedias.length) {
            changed.productMedias = mediasDiff as any;
        }
    }

    // Diffing Product Variants
    if (current.productVariants !== initial.productVariants) {
        const variantsDiff: any[] = [];
        const currentVariants = current.productVariants || [];
        const initialVariants = initial.productVariants || [];

        currentVariants.forEach(currentVariant => {
            const initialVariant = initialVariants.find(v => v.variantTypeId === currentVariant.variantTypeId && currentVariant.variantTypeId !== undefined);

            if (!initialVariant) {
                // Brand new variant
                variantsDiff.push(currentVariant);
            } else {
                const variantChanges: any = {};
                let hasChanges = false;

                if (currentVariant.variantTypeName !== initialVariant.variantTypeName) {
                    variantChanges.variantTypeName = currentVariant.variantTypeName;
                    hasChanges = true;
                }

                // Diff options
                if (currentVariant.variantOptions !== initialVariant.variantOptions) {
                    const optionsDiff: any[] = [];
                    const currentOptions = currentVariant.variantOptions || [];
                    const initialOptions = initialVariant.variantOptions || [];

                    currentOptions.forEach(currentOption => {
                        const initialOption = initialOptions.find(o => o.variantOptionId === currentOption.variantOptionId && currentOption.variantOptionId !== undefined);
                        if (!initialOption) {
                            optionsDiff.push(currentOption);
                        } else {
                            const optionChanges: any = {};
                            let optionHasChanges = false;

                            if (currentOption.variantOptionValue !== initialOption.variantOptionValue) {
                                optionChanges.variantOptionValue = currentOption.variantOptionValue;
                                optionHasChanges = true;
                            }
                            if (currentOption.variantOptionPrice !== initialOption.variantOptionPrice) {
                                optionChanges.variantOptionPrice = currentOption.variantOptionPrice;
                                optionHasChanges = true;
                            }
                            if (currentOption.imageUrl !== initialOption.imageUrl) {
                                optionChanges.imageUrl = currentOption.imageUrl;
                                optionHasChanges = true;
                            }

                            if (optionHasChanges) {
                                optionsDiff.push({ ...optionChanges, variantOptionId: currentOption.variantOptionId });
                            } else {
                                // Include unmodified option by its ID
                                optionsDiff.push({ variantOptionId: currentOption.variantOptionId });
                            }
                        }
                    });

                    if (optionsDiff.length > 0 || currentOptions.length !== initialOptions.length) {
                        variantChanges.variantOptions = optionsDiff;
                        hasChanges = true;
                    }
                }

                if (hasChanges) {
                    variantsDiff.push({ ...variantChanges, variantTypeId: currentVariant.variantTypeId });
                } else {
                    // Include unmodified variant array by ID, and include unchanged nested option IDs as well
                    const unchangedOpts = (currentVariant.variantOptions || []).map(o => ({ variantOptionId: o.variantOptionId }));
                    variantsDiff.push({
                        variantTypeId: currentVariant.variantTypeId,
                        variantOptions: unchangedOpts
                    });
                }
            }
        });

        if (variantsDiff.length > 0 || currentVariants.length !== initialVariants.length) {
            changed.productVariants = variantsDiff as any;
        }
    }

    return changed;
};
