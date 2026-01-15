'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import Image from "next/image";
import { worksans } from "@/types/fonts";
import { motion } from "framer-motion";

import { numericConverter } from "@/utils/priceUtils";
import { buildProductImages, UIProductImage } from "@/utils/productMedia.UI";


import { ProductDetails, ProductDetailsShow, VariantOptionsShow } from "@/lib/api/productService";


const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function Product() {
  const router = useRouter();
  const params = useParams();
  const { productId, productName } = params;

  const [productDetails, setProductDetails] = useState<ProductDetailsShow>();
  const [productImages, setProductImages] = useState<UIProductImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedVariantOption, setSelectedVariantOption] = useState<VariantOptionsShow | null>(null);

  useEffect(() => {
    ProductDetails(Number(productId))
      .then((details) => setProductDetails(details))
      .catch((err) => console.error(err));
  }, [productId, productName]);

  useEffect(() => {
    if (!productDetails) return;

    const images = buildProductImages(productDetails);
    setProductImages(images);

    let defaultImage: UIProductImage | undefined;

    defaultImage = images.find((img) => img.source === 'product' && img.isMain);

    if (!defaultImage) {
      defaultImage = images.find((img) => img.source === 'variant');
    }

    if (!defaultImage) {
      defaultImage = images[0];
    }

    setSelectedImageId(defaultImage?.id ?? null);
  }, [productDetails]);


  const handleSelectVariantOption = (option: VariantOptionsShow) => {
    setSelectedVariantOption(option);
    console.log(option)

    const uiImage = productImages.find(
      (img) => img.source === 'variant' && img.id === `variant-${option.variantOptionId}`
    );

    if (uiImage) setSelectedImageId(uiImage.id);
  };



  const baseAndVariantSumPrice = (): string => {
    if (!productDetails || !selectedVariantOption) return "0.00";

    const basePrice = parseFloat(productDetails.basePrice) || 0;
    const variantPrice = parseFloat(selectedVariantOption.variantOptionPrice) || 0;

    return (basePrice + variantPrice).toFixed(2);
  };



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
          <h3 className='text-lg font-bold text-secondary'>
            {productDetails?.subCategoryName}
          </h3>
          <h3 className='text-lg font-bold text-tertiaryColor'>
            {numericConverter(String(selectedVariantOption ? baseAndVariantSumPrice() : productDetails?.basePrice))}
          </h3>

          {productDetails?.productVariants?.map((variant, index) => (
            <div key={index} className="border-t border-greyColor">
              <h3 className="font-bold text-base text-primaryColor">{variant.variantTypeName.toUpperCase()}</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {variant.variantOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectVariantOption(option)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${option.variantOptionId === selectedVariantOption?.variantOptionId
                        ? "bg-primaryColor text-tertiaryColor"
                        : "border border-secondary text-primaryColor hover:bg-primaryColor/10"
                      }`}
                  >
                    {option.variantOptionValue}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {(productDetails?.description || productDetails?.specification) && (
          <div className="container flex flex-col text-primaryColor text-base font-semibold gap-y-4 border border-greyColor bg-mainBackgroundColor rounded-xl px-4 py-2 mt-4">
            {productDetails?.description && (
              <>
                <p className="text-tertiaryColor text-lg">Description</p>
                <p className="whitespace-pre-line">{productDetails.description}</p>
              </>
            )}
            {productDetails?.features && (
              <>
                <p className="text-tertiaryColor text-lg">Features</p>
                <p className="whitespace-pre-line">{productDetails.features}</p>
              </>
            )}
            {productDetails?.specification && (
              <>
                <p className="text-tertiaryColor text-lg">Specifications</p>
                <p className="whitespace-pre-line">{productDetails.specification}</p>
              </>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col items-center gap-4 mt-6"
      >
        <div className="w-full h-[700px] relative">
          {selectedImageId && (
            <Image
              src={`${baseURL}${productImages.find(img => img.id === selectedImageId)?.imageUrl}`}
              alt={productDetails?.productTitle || "Product"}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain rounded-lg"
              priority
            />
          )}
        </div>

        {productImages.length > 1 && (
          <div className="flex gap-3 justify-center flex-wrap mt-4">
            {productImages.map((img) => (
              <motion.button
                key={img.id}
                onClick={() => {
                  setSelectedImageId(img.id)
                }}
                className={`relative w-24 h-24 border rounded-md overflow-hidden transition
                  ${selectedImageId === img.id
                    ? "border-primaryColor ring-2 ring-primaryColor"
                    : "border-greyColor"
                  }`}
              >
              <Image
                src={`${baseURL}${img.imageUrl}`}
                alt="Thumbnail"
                fill
                sizes="96px"
                loading="lazy"
                decoding="async"
                className="object-cover"
              />
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}
