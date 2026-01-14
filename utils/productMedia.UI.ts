export type UIProductImage = {
  id: string;
  imageUrl: string;
  source: 'product' | 'variant';
  isMain?: boolean; // optional, only for product images
};


import { ProductDetailsShow } from "@/lib/api/productService";

export const buildProductImages = (
  details: ProductDetailsShow
): UIProductImage[] => {
  const images: UIProductImage[] = [];

  details.productMedias?.forEach((media, index) => {
    images.push({
      id: `product-${index}`,
      imageUrl: media.imageUrl,
      source:'product',
      isMain: media.isMain,
    });
  });

  details.productVariants?.forEach((variant) => {
    variant.variantOptions.forEach((option) => {
      images.push({
        id: `variant-${option.variantOptionId}`,
        imageUrl: option.imageUrl,
        source:'variant'
      });
    });
  });
  return images;
};
