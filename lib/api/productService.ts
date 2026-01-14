import axios from "axios";
import { uploadImages, UploadImageProps } from "./uploadImage";
import { option } from "framer-motion/client";


interface VariantDetails{
  variantTypeName: string;
  variantOptions: VariantOption[];
}

interface VariantOption {
  variantOptionValue:string;
  price_adjusting:string;
  variant_image: File | null;
}

interface VariantOptionToSend {
  variantOptionValue:string;
  price_adjustment:string;
  variant_image: string | null;
}

interface VariantDetailsToSend{
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


interface ProductDetails {
  productTitle: string;
  basePrice:string;
  brandId: number | null;
  categoryId: number | null;
  subCategoryId:number | null;
  description: string | null;
  features: string | null;
  specifications: string | null;
  variants: VariantDetails[];
  medias: ProductImageInput[];
}

interface ProductImageToSend {
  url: string;
  isMain: boolean;
}


export async function createProduct(product:ProductDetails){
  const {
    productTitle,
    basePrice,
    brandId,
    categoryId,
    subCategoryId,
    description,
    specifications,
    features,
    medias,
    variants
  } = product;

  const productToSend: {
    category_id: string;
    sub_category_id:string;
    brand_id:string | null;
    product_title: string;
    base_price: string;
    description:string;
    specifications:string;
    features:string;
    medias: ProductImageToSend[];
    variants: VariantDetailsToSend[]
  } = {
    category_id: categoryId ? categoryId.toString() : '',
    sub_category_id: subCategoryId ? subCategoryId.toString() : '',
    brand_id: brandId ? brandId.toString() : '',
    product_title: productTitle,
    base_price : parseFloat(basePrice === '' ? '0' : basePrice).toString(),
    description: description || '',
    specifications: specifications || '',
    features: features || '',
    medias: [],
    variants:[] 
  } 

  if(Array.isArray(medias) && medias.length > 0){
    const uploadedMedia = await createProductMedia(medias);
    productToSend.medias.push(...uploadedMedia)
    console.log(productToSend);
  }

  if(Array.isArray(variants) && variants.length > 0){
    const uploadVariant:VariantDetailsToSend[] = await createProductVariant(variants)
    productToSend.variants.push(...uploadVariant);
  }

  console.log(productToSend);
  
  axios.post('/api/products/store', productToSend)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => console.error('Error fetching brands:', error));
}

export async function createProductMedia(
  medias: ProductImageInput[]
): Promise<ProductImageToSend[]> {
  try {
    const toUploadImage:UploadImageProps[] = []

    medias.forEach((media,index) => {
      toUploadImage.push({
      file:media.file,
      originIndex:index
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
      if (option.variant_image) {
        toUploadImage.push({
          file: option.variant_image,
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
  variantOptionId:number;
  imageUrl:string
  variantOptionValue:string
  variantOptionPrice:string
}

export interface ProductMediaShow {
  imageUrl:string;
  isMain:boolean;
}

interface ProductVariantShow {
  variantTypeName:string;
  variantOptions:VariantOptionsShow[];
}

export interface ProductDetailsShow {
  productId:number;
  productTitle:string;
  basePrice:string;
  brandName:string;
  specification:string;
  features:string;
  description:string;
  subCategoryName:string;
  productMedias:ProductMediaShow[] | null;
  productVariants:ProductVariantShow[] | null;
}


export async function ProductDetails(id: number) {
  try {
    const res = await axios.get(`/api/products/productdetail/${id}`);
    const detail = res.data.productdetail;
    return detail;  
  } catch (err) {
    console.error(err);
    return null;  
  }
}

interface ProductListOptionDashboard {
  optionName:string;
}

interface ProductLisVariantDashboard {
  variantTypeName:string;
  variantOptions: ProductListOptionDashboard[]
}

export interface ProductListDashboard {
  productId:number;
  productTitle:string;
  basePrice:string;
  brandName:string
  subCategoryName:string;
  productTypeVariant:ProductLisVariantDashboard [];
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