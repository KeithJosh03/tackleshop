'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

import { worksans } from "@/types/fonts";
import { motion } from "framer-motion";

import { numericConverter } from "@/utils/priceUtils";


import {  ProductDetails,
          ProductDetailsShow, 
          VariantOptionsShow,
          ProductMediaShow 
} from "@/lib/api/productService";

type ProductImages = ProductMediaShow | VariantOptionsShow;

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function Product () {
  const router = useRouter();
  const params = useParams();
  const { productId, productName } = params;
  const [productDetails, setProductDetails] = useState<ProductDetailsShow>();
  const [selectedVariantOption, setselectecVariantOption] = useState<VariantOptionsShow>();
  const [productImages, setproductImages] = useState<ProductImages[]>([]);
  const [testproductImages, settestProductImages] = useState<ProductImages[]>([]); 
  const [selectedImage, setselectSelectImage] = useState<ProductImages | null>(null); 
  
  useEffect(() => {
    ProductDetails(Number(productId))
      .then((productDetails) => {
        setProductDetails(productDetails);
      })
      .catch((err) => console.error(err));
  }, [productId, productName, selectedVariantOption]); // Re-run when these values change


  useEffect(() => {
    if (!productDetails) return;

    let medias: ProductImages[] = [];

    if(productDetails.productMedias !== null){
      setselectSelectImage(productDetails.productMedias[0])
    }

    if(productDetails.productVariants !== null && selectedImage === null){
      setselectSelectImage(productDetails.productVariants[0].variantOptions[0])
    }


    if (productDetails.productMedias !== null) {
      medias = [...productDetails.productMedias];
    }

    if (productDetails.productVariants !== null) {
      productDetails.productVariants.forEach((variant) => {
        medias = [...variant.variantOptions]
      })
    }

    setproductImages(medias); 
  }, [productDetails]);




  const baseAndvariantSumPrice = (): string => {
    if (!productDetails || !selectedVariantOption) return "0.00";

    const basePrice = parseFloat(productDetails.basePrice.toString()) || 0;
    const variantOptionPrice = parseFloat(selectedVariantOption.variantOptionPrice.toString()) || 0;

    const totalPrice = basePrice + variantOptionPrice;

    return totalPrice.toFixed(2);
  };

  console.log(productDetails?.productVariants)


return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`flex flex-col ${worksans.className} px-10 gap-y-2`}
      >
        <div className="container flex flex-col gap-y-1 gradientBackGround rounded-xl px-4 py-2 border border-greyColor">
          <h4 className="text-tertiaryColor font-bold">
            {productDetails?.brandName.toUpperCase()}
          </h4>
          <h1 className="text-primaryColor text-4xl font-bold">
            {productDetails?.productTitle}
          </h1>
          {/* {selectedVariant && (
            <h3 className={`text-xl font-bold text-secondary`}>
              {selectedVariant?.variantName}
            </h3>
          )} */}
          <h3 className='text-lg font-bold text-secondary'>
            {productDetails?.subCategoryName}
          </h3>
          <h3 className='text-lg font-bold text-tertiaryColor'>
            {numericConverter(String(selectedVariantOption ? baseAndvariantSumPrice() : productDetails?.basePrice))}
          </h3>
          {/* {selectedVariant?.price !== null && selectedVariant?.discountType !== null ? (
            <>
              <h2 className="text-tertiaryColor text-sm font-bold line-through opacity-70">
                {numericConverter(String(selectedVariant?.price))}  
              </h2>
              <h2 className="text-primaryColor text-xl font-extrabold">
                {selectedVariant?.discountType === 'Unit' 
                  ? numericConverter(UnitDiscount(selectedVariant?.price ?? "0", selectedVariant?.discountPrice ?? "0"))
                  : numericConverter(PercentageDiscount(selectedVariant?.price ?? "0", selectedVariant?.discountPrice ?? "0"))} 
              </h2>
              <p className="text-xs text-green-400 font-medium">
                {selectedVariant?.discountType == 'Unit' 
                  ? `Discounted ${numericConverter(selectedVariant?.discountPrice ?? "0")}` 
                  : `${selectedVariant?.discountPrice ?? "0"}% Off`}  
              </p>
            </>
            ) : (
              <h2 className="text-primaryColor text-xl font-bold">
                {numericConverter(selectedVariant?.price)}
              </h2>
            )
          } */}

          {productDetails?.productVariants !== null && (
            productDetails?.productVariants.map((variant,index) => (
            <div 
            className="border-t border-greyColor"
            key={index}>
              <h3 className="font-bold text-base text-primaryColor mt-4">{variant.variantTypeName.toUpperCase()}</h3>
              <div className="flex flex-wrap gap-3">
                {variant.variantOptions.map((option,indexx) => (
                <button
                  key={indexx}
                  onClick={() => {
                    setselectecVariantOption(option)
                    setselectSelectImage(option)
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 
                    ${
                      option.variantOptionId === selectedVariantOption?.variantOptionId
                        ? "bg-primaryColor text-tertiaryColor"
                        : "border border-secondary text-primaryColor hover:bg-primaryColor/10"
                    }`}
                >
                  {option.variantOptionValue}
                </button>
                ))

                }
              
              </div>
            </div>
            ))
          )}




        </div>



        
        

        {productDetails?.description !== null || productDetails?.specification !== null ? (
        <div className="container flex flex-col text-primaryColor text-base font-semibold gap-y-4  border border-greyColor bg-mainBackgroundColor rounded-xl px-4 py-2">
          <div>
            {productDetails?.description && (
              <p className="text-tertiaryColor text-lg">Description</p>
            )}
            <p className="whitespace-pre-line align-top">{productDetails?.description}</p>
          </div>
          <div>
            {productDetails?.features && (
            <p className="text-tertiaryColor text-lg">Features</p>
            )}
            <p className="whitespace-pre-line">{productDetails?.features}</p>
          </div>
          <div>
            {productDetails?.specification && (
              <p className="text-tertiaryColor text-lg">Specifications</p>
            )}
            <p className="whitespace-pre-line">{productDetails?.specification}</p>
          </div>
        </div>
        ) :
        <></>
        }
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-full max-w-[auto] h-[700px] relative">
          {selectedImage && (
            <Image
              src={`${baseURL}${selectedImage.imageUrl}`} 
              alt={productDetails?.productTitle || "Product"}
              fill
              className="object-contain rounded-lg"
            />
          )}
        </div>

        {productImages?.length !== 1 ? (
          <div className="flex gap-3 justify-center flex-wrap">
            {productImages?.map((img, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setselectSelectImage(img)
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 + 0.5 }}
                className={`relative w-24 h-24 border rounded-md overflow-hidden transition 
                  ${
                    selectedImage === img
                      ? "border-primaryColor ring-2 ring-primaryColor"
                      : "border-greyColor"
                  }`}
              >
                <Image
                  src={`${baseURL}${img.imageUrl}`} 
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>
        )
        : <></>
        }
      </motion.div>
    </>
  );
}

