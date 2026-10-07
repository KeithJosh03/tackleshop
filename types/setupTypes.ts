export interface SetupMedia {
    mediaId: number;
    imageUrl: string;
    isMain: boolean;
}

export interface SetupBundleItem {
    setupItemId?: number;
    productId: number;
    productTitle?: string;
    skuId?: number | null;
    skuCode?: string | null;
    quantity: number;
    isRequired: boolean;
    groupName?: string | null;
    thumbnailUrl?: string | null;
}

export interface SetupInclusion {
    title: string;
    price: string;
    quantity: number;
    isRequired: boolean;
}

export interface SetupDetailsViewProps {
    setupId: number;
    bundleTitle: string;
    slug: string;
    description?: string | null;
    sku?: string;
    pricingType?: string;
    bundlePrice: string;
    retailPrice?: string | null;
    finalPrice: string;
    compareAtPrice?: string | null;
    hasDiscount: boolean;
    discountLabel?: string | null;
    stockQuantity: number;
    inStock: boolean;
    categoryName?: string | null;
    setupMedias: SetupMedia[];
    bundleItems: SetupBundleItem[];
    inclusions: SetupInclusion[];
}
