export type UIProductImage = {
  id: string;
  imageUrl: string;
  source: 'product' | 'variant' | 'sku';
  isMain?: boolean;
};


import { ProductDetailsViewProps } from "@/types/productTypes";

export const buildProductImages = (
  details: ProductDetailsViewProps
): UIProductImage[] => {
  const images: UIProductImage[] = [];

  console.log(details);

  details.productMedias?.forEach((media, index) => {
    if (media.imageUrl) {
      images.push({
        id: `product-${index}`,
        imageUrl: media.imageUrl,
        source: 'product',
        isMain: media.isMain,
      });
    }
  });

  details.productVariants?.forEach((variant) => {
    variant.variantOptions.forEach((option) => {
      if (option.imageUrl && typeof option.imageUrl === 'string') {
        images.push({
          id: `variant-${option.variantOptionId}`,
          imageUrl: option.imageUrl,
          source: 'variant',
        });
      }
    });
  });

  // Pull images from SKUs
  details.productSkus?.forEach((sku) => {
    sku.skuImages?.forEach((img, idx) => {
      if (img.imageUrl) {
        images.push({
          id: `sku-${sku.skuId}-${idx}`,
          imageUrl: img.imageUrl,
          source: 'sku',
          isMain: img.isMain,
        });
      }
    });
  });

  return images;
};
