import { ProductDetailsEditProps } from "@/types/productTypes";

export const getModifiedFields = (
    initial: ProductDetailsEditProps,
    current: ProductDetailsEditProps
): Record<string, any> => {
    const changed: Record<string, any> = {};

    /* ── Simple scalar fields ── */
    if (current.productTitle !== initial.productTitle) changed.productTitle = current.productTitle;
    if (current.basePrice !== initial.basePrice) changed.basePrice = current.basePrice;
    if (current.description !== initial.description) changed.description = current.description;
    if (current.features !== initial.features) changed.features = current.features;
    if (current.specifications !== initial.specifications) changed.specifications = current.specifications;

    /* ── Brand / Category / SubCategory (compare by ID) ── */
    const getBrandId = (b: any) => b?.brandId || null;
    if (getBrandId(current.brand) !== getBrandId(initial.brand)) changed.brand = current.brand;

    const getCategoryId = (c: any) => c?.categoryId || null;
    if (getCategoryId(current.category) !== getCategoryId(initial.category)) changed.category = current.category;

    const getSubId = (s: any) => s?.subCategoryId || null;
    if (getSubId(current.subCategory) !== getSubId(initial.subCategory)) changed.subCategory = current.subCategory;

    /* ────────────────────────────────────────────────────────
       Diffing Product Medias
       ──────────────────────────────────────────────────────── */
    const currentMedias = current.productMedias || [];
    const initialMedias = initial.productMedias || [];

    const mediasChanged =
        currentMedias.length !== initialMedias.length ||
        currentMedias.some((cm, i) => {
            const im = initialMedias[i];
            if (!im) return true;
            return cm.imageId !== im.imageId ||
                cm.imageUrl !== im.imageUrl ||
                cm.isMain !== im.isMain ||
                cm.file !== im.file;
        });

    if (mediasChanged) {
        const mediasDiff: any[] = [];

        currentMedias.forEach(currentMedia => {
            const initialMedia = initialMedias.find(
                m => m.imageId === currentMedia.imageId && currentMedia.imageId !== undefined
            );

            if (!initialMedia) {
                // ── New media (uploaded by user) ──
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
                    // Unchanged media – include ID so backend keeps it
                    mediasDiff.push({ imageId: currentMedia.imageId });
                }
            }
        });

        // ── Removed medias (present in initial, absent in current) ──
        const removedMediaIds = initialMedias
            .filter(im => im.imageId !== undefined && !currentMedias.some(cm => cm.imageId === im.imageId))
            .map(im => im.imageId!);

        if (mediasDiff.length > 0 || removedMediaIds.length > 0) {
            changed.productMedias = mediasDiff;
        }
        if (removedMediaIds.length > 0) {
            changed.removedMediaIds = removedMediaIds;
        }
    }

    /* ────────────────────────────────────────────────────────
       Diffing Product Variants
       ──────────────────────────────────────────────────────── */
    const currentVariants = current.productVariants || [];
    const initialVariants = initial.productVariants || [];

    const removedVariantTypeIds = initialVariants
        .filter(iv => !currentVariants.some(cv => cv.variantTypeId === iv.variantTypeId))
        .map(iv => iv.variantTypeId);

    const removedVariantOptionIds: number[] = [];

    const variantsChanged =
        currentVariants.length !== initialVariants.length ||
        removedVariantTypeIds.length > 0 ||
        currentVariants.some(cv => {
            const iv = initialVariants.find(v => v.variantTypeId === cv.variantTypeId);
            if (!iv) return true;
            if (cv.variantTypeName !== iv.variantTypeName) return true;
            if (cv.variantOptions.length !== iv.variantOptions.length) return true;
            return cv.variantOptions.some(co => {
                const io = iv.variantOptions.find(o => o.variantOptionId === co.variantOptionId);
                if (!io) return true;
                return co.variantOptionValue !== io.variantOptionValue ||
                    co.variantOptionPrice !== io.variantOptionPrice ||
                    co.imageUrl !== io.imageUrl;
            });
        });

    if (variantsChanged) {
        const variantsDiff: any[] = [];

        currentVariants.forEach(currentVariant => {
            const initialVariant = initialVariants.find(
                v => v.variantTypeId === currentVariant.variantTypeId && currentVariant.variantTypeId !== undefined
            );

            if (!initialVariant) {
                // ── Brand new variant ──
                variantsDiff.push(currentVariant);
            } else {
                const variantChanges: any = {};
                let hasChanges = false;

                if (currentVariant.variantTypeName !== initialVariant.variantTypeName) {
                    variantChanges.variantTypeName = currentVariant.variantTypeName;
                    hasChanges = true;
                }

                // ── Diff variant options ──
                const currentOptions = currentVariant.variantOptions || [];
                const initialOptions = initialVariant.variantOptions || [];

                // Track removed options for this variant
                const removedOpts = initialOptions
                    .filter(io => !currentOptions.some(co => co.variantOptionId === io.variantOptionId))
                    .map(io => io.variantOptionId);
                removedVariantOptionIds.push(...removedOpts);

                const optionsChanged =
                    currentOptions.length !== initialOptions.length ||
                    removedOpts.length > 0 ||
                    currentOptions.some(co => {
                        const io = initialOptions.find(o => o.variantOptionId === co.variantOptionId);
                        if (!io) return true;
                        return co.variantOptionValue !== io.variantOptionValue ||
                            co.variantOptionPrice !== io.variantOptionPrice ||
                            co.imageUrl !== io.imageUrl;
                    });

                if (optionsChanged) {
                    const optionsDiff: any[] = [];

                    currentOptions.forEach(currentOption => {
                        const initialOption = initialOptions.find(
                            o => o.variantOptionId === currentOption.variantOptionId && currentOption.variantOptionId !== undefined
                        );

                        if (!initialOption) {
                            // New option
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
                                // Include unchanged option by ID
                                optionsDiff.push({ variantOptionId: currentOption.variantOptionId });
                            }
                        }
                    });

                    variantChanges.variantOptions = optionsDiff;
                    hasChanges = true;
                }

                if (hasChanges) {
                    variantsDiff.push({ ...variantChanges, variantTypeId: currentVariant.variantTypeId });
                } else {
                    // Include unchanged variant with its option IDs
                    const unchangedOpts = (currentVariant.variantOptions || []).map(o => ({
                        variantOptionId: o.variantOptionId
                    }));
                    variantsDiff.push({
                        variantTypeId: currentVariant.variantTypeId,
                        variantOptions: unchangedOpts
                    });
                }
            }
        });

        if (variantsDiff.length > 0 || removedVariantTypeIds.length > 0) {
            changed.productVariants = variantsDiff;
        }
        if (removedVariantTypeIds.length > 0) {
            changed.removedVariantTypeIds = removedVariantTypeIds;
        }
        if (removedVariantOptionIds.length > 0) {
            changed.removedVariantOptionIds = removedVariantOptionIds;
        }
    }

    return changed;
};
