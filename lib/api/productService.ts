import axios from "axios";
import { uploadImages, UploadImageProps } from "./uploadImage";

import { NextResponse } from 'next/server';

import { BrandProps } from "@/types/dataprops";
import { Category } from "@/types/categoryType";
import { SubCategory } from "@/types/subCategoryTypes";


interface VariantDetails {
  variantTypeName: string;
  variantOptions: VariantOption[];
}

interface VariantOption {
  variantOptionValue: string;
  price_adjusting: string;
  imageUrl: File | null;
}

interface VariantOptionToSend {
  variantOptionValue: string;
  price_adjustment: string;
  variant_image: string | null;
}

interface VariantDetailsToSend {
  variantTypeName: string;
  variantOptions: VariantOptionToSend[];
}

interface ProductImageInput {
  file: File;
  isMain: boolean;
}

interface ProductImageToSend {
  url: string;
  isMain: boolean;
}

// 🚨 UPDATED: Added global inventory parameter fields to interface tracking
interface ProductDetails {
  productTitle: string;
  basePrice: string;
  brand: BrandProps | null;
  category: Category | null;
  subCategory: SubCategory | null;
  description: string | null;
  features: string | null;
  specifications: string | null;
  variants: VariantDetails[];
  medias: ProductImageInput[];
  masterSku?: string;      // 👈 Added for No-Variant support
  initialStock?: string;   // 👈 Added for No-Variant support
  variantMatrixRows?: any[]; // To receive the dynamically generated rows from frontend
}

export async function createProduct(product: ProductDetails) {
  const {
    productTitle,
    basePrice,
    brand,
    category,
    subCategory,
    description,
    specifications,
    features,
    medias,
    variants,
    masterSku,
    initialStock,
    variantMatrixRows
  } = product;

  // 🚨 UPDATED: Data model blueprint maps global fields down to JSON network stream in strictly snake_case!
  const productToSend: any = {
    category_id: category ? category.categoryId.toString() : '',
    sub_category_id: subCategory ? subCategory.subCategoryId.toString() : '',
    brand_id: brand ? brand.brandId.toString() : '',
    product_title: productTitle,
    base_price: parseFloat(basePrice === '' ? '0' : basePrice).toString(),
    description: description || '',
    specifications: specifications || '',
    features: features || '',
    sku: masterSku || null,
    stock_quantity: initialStock ? parseInt(initialStock, 10) : null,
    medias: [],
    variants: variants || []
  };

  // Asynchronous image bucket uploads (Works perfectly for both branches!)
  if (Array.isArray(medias) && medias.length > 0) {
    const uploadedMedia = await createProductMedia(medias);
    productToSend.medias.push(...uploadedMedia);
  }

  // Variations Matrix configuration branch loop
  if (Array.isArray(variants) && variants.length > 0) {
    const uploadVariant: VariantDetailsToSend[] = await createProductVariant(variants);
    productToSend.variants = uploadVariant;

    // Clean up parent parameters if variants are explicitly defined
    productToSend.sku = null;
    productToSend.stock_quantity = null;

    // 🚨 CRITICAL NEW PAYLOAD KEY FOR THE DATABASE ROWS
    if (variantMatrixRows && variantMatrixRows.length > 0) {
      const matrixPayload = [];

      for (const row of variantMatrixRows) {
        let image_url: string | null = null;

        if (row.imageUrl instanceof File) {
          const uploaded = await uploadImages([{ file: row.imageUrl, originIndex: 0 }]);
          image_url = uploaded[0]?.url ?? null;
        }

        matrixPayload.push({
          sku_code: row.skuCode,
          price: parseFloat(row.price).toString(),
          stock_quantity: parseInt(row.stockQuantity, 10) || 0,
          variant_option_ids: row.variantOptionIds,
          ...(image_url ? { image_url } : {}),
        });
      }

      productToSend.variant_matrix = matrixPayload;
    }
  }

  console.log('Sending payload via native fetch:', productToSend);

  try {
    const response = await fetch('/api/products/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // 🚨 CRITICAL: Tells Laravel to return JSON errors instead of HTML
      },
      body: JSON.stringify(productToSend),
    });

    if (!response.ok) {
      // 💡 Read response as text first to handle any runaway HTML gracefully
      const errorText = await response.text();
      let errorMessage = `Server error ${response.status}`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // If it's still HTML, the errorText will contain the actual Laravel crash report
        console.error("Raw Laravel HTML Crash Report Error:", errorText);
        errorMessage = `Laravel crashed with status ${response.status}. Check your browser DevTools Console Network tab!`;
      }

      throw new Error(errorMessage);
    }

    return await response.json();

  } catch (error: any) {
    console.error('Error creating product via fetch:', error);
    throw new Error(error.message || 'An unexpected error occurred while creating the product.');
  }
}



// ProductDetailsShow
export async function editProductDetails(id: number, changedFields: any) {
  const payload: Record<string, any> = {};

  // ── 1. Map scalar fields to snake_case ──
  if (changedFields.productTitle !== undefined) payload.product_title = changedFields.productTitle;
  if (changedFields.basePrice !== undefined) payload.base_price = parseFloat(changedFields.basePrice === '' ? '0' : changedFields.basePrice);
  if (changedFields.description !== undefined) payload.description = changedFields.description;
  if (changedFields.features !== undefined) payload.features = changedFields.features;
  if (changedFields.specifications !== undefined) payload.specifications = changedFields.specifications;

  if (changedFields.brand !== undefined) payload.brand_id = changedFields.brand?.brandId ?? null;
  if (changedFields.category !== undefined) payload.category_id = changedFields.category?.categoryId ?? null;
  if (changedFields.subCategory !== undefined) payload.sub_category_id = changedFields.subCategory?.subCategoryId ?? null;

  // ── 2. Handle product medias (upload new Files, keep existing URLs) ──
  if (changedFields.productMedias !== undefined) {
    const mediasToUpload: UploadImageProps[] = [];
    const mediasPayload: { image_id?: number; url?: string; isMain?: boolean }[] = [];

    changedFields.productMedias.forEach((media: any, index: number) => {
      if (media.file instanceof File) {
        // New media — needs upload
        mediasToUpload.push({ file: media.file, originIndex: index });
        mediasPayload.push({ isMain: media.isMain ?? false }); // url filled after upload
      } else if (media.imageId) {
        // Existing media — send ID + changed fields only
        const entry: any = { image_id: media.imageId };
        if (media.isMain !== undefined) entry.isMain = media.isMain;
        mediasPayload.push(entry);
      }
    });

    // Upload new media files
    if (mediasToUpload.length > 0) {
      const uploaded = await uploadImages(mediasToUpload);
      uploaded.forEach((file) => {
        mediasPayload[file.originIndex] = {
          ...mediasPayload[file.originIndex],
          url: file.url,
        };
      });
    }

    payload.medias = mediasPayload;
  }

  // ── 3. Removed media IDs ──
  if (changedFields.removedMediaIds && changedFields.removedMediaIds.length > 0) {
    payload.removed_media_ids = changedFields.removedMediaIds;
  }

  // ── 4. Handle variants (upload new variant option images, transform keys) ──
  if (changedFields.productVariants !== undefined) {
    const variantsPayload: any[] = [];

    for (const variant of changedFields.productVariants) {
      const variantEntry: any = {};

      if (variant.variantTypeId) variantEntry.variant_type_id = variant.variantTypeId;
      if (variant.variantTypeName !== undefined) variantEntry.variant_type_name = variant.variantTypeName;

      if (variant.variantOptions) {
        const optionsPayload: any[] = [];
        const optionsToUpload: UploadImageProps[] = [];
        const optionUploadIndexMap: number[] = []; // maps upload index back to option index

        variant.variantOptions.forEach((opt: any, optIndex: number) => {
          const optEntry: any = {};
          if (opt.variantOptionId) optEntry.variant_option_id = opt.variantOptionId;
          if (opt.variantOptionValue !== undefined) optEntry.variant_option_value = opt.variantOptionValue;
          if (opt.variantOptionPrice !== undefined) optEntry.price_adjustment = parseFloat(opt.variantOptionPrice === '' ? '0' : opt.variantOptionPrice);

          // Handle variant option image
          if (opt.imageUrl instanceof File) {
            // New file — upload it
            optionsToUpload.push({ file: opt.imageUrl, originIndex: optionsToUpload.length });
            optionUploadIndexMap.push(optIndex);
            // image_url placeholder, filled after upload
          } else if (opt.imageUrl === null) {
            optEntry.image_url = null; // removed
          } else if (typeof opt.imageUrl === 'string') {
            optEntry.image_url = opt.imageUrl; // changed URL string
          }

          optionsPayload.push(optEntry);
        });

        // Upload variant option images
        if (optionsToUpload.length > 0) {
          const uploaded = await uploadImages(optionsToUpload);
          uploaded.forEach((file) => {
            const optIndex = optionUploadIndexMap[file.originIndex];
            optionsPayload[optIndex].image_url = file.url;
          });
        }

        variantEntry.variant_options = optionsPayload;
      }

      variantsPayload.push(variantEntry);
    }

    payload.variants = variantsPayload;
  }

  // ── 5. Removed variant type IDs ──
  if (changedFields.removedVariantTypeIds && changedFields.removedVariantTypeIds.length > 0) {
    payload.removed_variant_type_ids = changedFields.removedVariantTypeIds;
  }

  // ── 6. Removed variant option IDs ──
  if (changedFields.removedVariantOptionIds && changedFields.removedVariantOptionIds.length > 0) {
    payload.removed_variant_option_ids = changedFields.removedVariantOptionIds;
  }

  console.log("Edit Product Payload:", payload);

  try {
    const response = await axios.put(`/api/products/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An unexpected error occurred while updating the product.');
  }
}



export async function createProductMedia(
  medias: ProductImageInput[]
): Promise<ProductImageToSend[]> {
  try {
    const toUploadImage: UploadImageProps[] = []

    medias.forEach((media, index) => {
      toUploadImage.push({
        file: media.file,
        originIndex: index
      })
    })

    const uploadedFiles = await uploadImages(toUploadImage);
    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new Error('No uploaded images returned');
    }
    return uploadedFiles.map((file, originIndex) => ({
      url: file.url,
      isMain: medias[originIndex].isMain
    }));

  } catch (err) {
    console.error('Upload Error', err);
    throw err;
  }
}


async function createProductVariant(
  variants: VariantDetails[]
): Promise<VariantDetailsToSend[]> {

  const uploadedVariants: VariantDetailsToSend[] = [];

  for (const variant of variants) {
    const toUploadImage: UploadImageProps[] = [];

    variant.variantOptions.forEach((option, index) => {
      if (option.imageUrl) {
        toUploadImage.push({
          file: option.imageUrl,
          originIndex: index
        });
      }
    });

    const uploadedFiles =
      toUploadImage.length > 0
        ? await uploadImages(toUploadImage)
        : [];

    const variantOptionsToSend: VariantOptionToSend[] =
      variant.variantOptions.map((option, index) => {
        const uploadedImage = uploadedFiles.find(
          file => file.originIndex === index
        );

        return {
          variantOptionValue: option.variantOptionValue,
          price_adjustment: option.price_adjusting === '' ? '0' : option.price_adjusting,
          variant_image: uploadedImage ? uploadedImage.url : null
        };
      });

    uploadedVariants.push({
      variantTypeName: variant.variantTypeName,
      variantOptions: variantOptionsToSend
    });
  }

  return uploadedVariants;
}


export interface VariantOptionsShow {
  variantOptionId: number;
  imageUrl: string
  variantOptionValue: string
  variantOptionPrice: string
}

export interface ProductMediaShow {
  imageUrl: string;
  isMain: boolean;
}

interface ProductVariantShow {
  variantTypeName: string;
  variantOptions: VariantOptionsShow[];
}

export interface ProductDetailsShow {
  productId: number;
  productTitle: string;
  basePrice: string;
  brandName: string;
  specifications: string;
  features: string;
  description: string;
  subCategoryName: string;
  productMedias: ProductMediaShow[] | null;
  productVariants: ProductVariantShow[] | null;
}

// ProductDetailsShow

export async function ProductDetails(id: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/productdetail/${id}`,
      { cache: "no-store" } // optional
    );

    if (!res.ok) {
      throw new Error("Failed to fetch product details");
    }

    const data = await res.json();
    return data.productdetail;
  } catch (err) {
    console.error(err);
    return null;
  }
}

interface ProductListOptionDashboard {
  optionName: string;
}

interface ProductLisVariantDashboard {
  variantTypeName: string;
  variantOptions: ProductListOptionDashboard[]
}

export interface ProductListDashboard {
  productId: number;
  productTitle: string;
  basePrice: string;
  brandName: string
  subCategoryName: string;
  productTypeVariant: ProductLisVariantDashboard[];
}

export interface ProductListDashboard {
  productId: number;
  productTitle: string;
  basePrice: string;
  brandName: string;
  subCategoryName: string;
  productTypeVariant: {
    variantTypeName: string;
    variantOptions: {
      optionName: string;
    }[];
  }[];
}

































// ProductListDashboard - Search

export async function ProductListDashboardSearch(
  search: string,
  page: number
) {
  const res = await axios.get(
    '/api/products/productlistdashboardsearch',
    {
      params: {
        productTitle: search,
        page,
      },
    }
  );

  return res.data;
}



// ProductDetailsEdit - Dashboard

export async function ProductDetailsEdit(id: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/productdetailEditDashboard/${id}`,
      { cache: "no-store" } // optional
    );

    if (!res.ok) {
      throw new Error("Failed to fetch product details");
    }

    const data = await res.json();
    return data.productdetail;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Product Search - SearchBar
export async function searchProductsTitleSearchBar(productTitle: string) {
  const res = await axios.get(
    '/api/products/productsearch',
    {
      params: {
        productTitle: productTitle,
      },
    }
  );
  return res.data.products || [];
}

// Product Delete - Dashboard
export async function DeleteProductDashboard(id: number) {
  try {
    const res = await axios.delete(`/api/products/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}