"use client";

import { useParams , useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { worksans } from "@/types/fonts";
import slugify from "slugify";
import { motion } from "framer-motion";


import { 
  ProductDetailsProps, 
  ProductDetailVariantProps,
  ProductDetailImageProps 
} from "@/types/dataprops";

interface ProductDetailsPropsResponse {
  status:boolean;
  productdetail:ProductDetailsProps;
}




export default function Product() {
  const params = useParams<{ productId: string; variantId: string; productName:string; }>();

  const productId = Number(params.productId);
  const variantId = Number(params.variantId);
  const productName = params.productName;


  const [productDetails, setProductDetail] = useState<ProductDetailsProps>();
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedVariant, setVariant] = useState<ProductDetailVariantProps>();
  const [imageOption, setImageOption] = useState<ProductDetailImageProps[]>();


  useEffect(() => {
  axios
      .get<ProductDetailsPropsResponse>(`/api/products/productdetail/${params.productId}`)
      .then((res) => {
      const detail = res.data.productdetail;

      setProductDetail(detail);
      })
      .catch((err) => console.log(err));
  }, [params.productId,productName]);


  useEffect(() => {
      if (!productDetails || !variantId) return;

      const foundVariant = productDetails.productVariant.find(
          (variant) => variant.variantId === variantId
      );

      if (foundVariant) {
          setVariant(foundVariant);
      }
  }, [variantId, productDetails]); 

  useEffect(() => {
    if (!selectedVariant) return;

    if (selectedVariant.allImage?.length > 0) {
      setImageOption(selectedVariant.allImage);

      const mainImage = selectedVariant.allImage.find((img) => img.isMain === 1);
      if (mainImage) {
        setSelectedImage(mainImage.url);
      } else {
        setSelectedImage(selectedVariant.allImage[0].url);
      }
    } 
    else {
      const fallbackVariant = productDetails?.productVariant.find(
        (variant) => variant.allImage && variant.allImage.length > 0
      );

      if (fallbackVariant) {
        setImageOption(fallbackVariant.allImage);

        const mainImage = fallbackVariant.allImage.find((img) => img.isMain === 1);
        if (mainImage) {
          setSelectedImage(mainImage.url);
        } else {
          setSelectedImage(fallbackVariant.allImage[0].url);
        }
      } else {
        setImageOption([]);
        setSelectedImage(undefined);
      }
    }
  }, [selectedVariant, productDetails?.productVariant]);


  const variantButton = (variantId: number) => {
    if (!productDetails) return;

    window.history.replaceState(
      null,
      "",
      `/product/${productId}/${slugify(productDetails.productName.toLowerCase() ?? "unknown")}/variant/${variantId}`
    );

    const foundVariant = productDetails.productVariant.find(
      (variant) => variant.variantId === variantId
    );
    if (foundVariant) {
      setVariant(foundVariant);
    }
  };

  let numericConverter = (number: string | undefined) => {
    if (number === undefined) {
      return "₱ 0.00"; // Handle undefined case
    }
    
    let numericPrice = Number(number);
    let formattedNumber = numericPrice.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formattedNumber;
  };


  const UnitDiscount = (price: string, discountPrice: string) => {
    const discountedPrice = (parseFloat(price) - parseFloat(discountPrice)).toFixed(2);
    return discountedPrice;
  };

  const PercentageDiscount = (price: string, discountPercentage: string ) => {
    const discountedPrice = (parseFloat(price) * (1 - parseFloat(discountPercentage) / 100)).toFixed(2);
    return discountedPrice;
  };

  console.log(`${selectedVariant?.price} ${typeof selectedVariant?.price}`)


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
            {productDetails?.productName}
          </h1>
          {productDetails?.typeName && (
            <h3 className={`text-lg font-bold ${selectedVariant?.discountType === null ? 'text-tertiaryColor' : 'text-secondary'}`}>
              {productDetails?.typeName}
            </h3>
          )}
          
          {selectedVariant?.price !== null && selectedVariant?.discountType !== null ? (
              <>
                <h2 className="text-tertiaryColor text-sm font-bold line-through opacity-70">
                  {numericConverter(selectedVariant?.price)}
                </h2>
                <h2 className="text-primaryColor text-xl font-extrabold">
                  {selectedVariant?.discountType === 'Unit' ? 
                    numericConverter(UnitDiscount(selectedVariant?.price, selectedVariant?.discountPrice)) 
                    : 
                    numericConverter(PercentageDiscount(selectedVariant?.price, selectedVariant?.discountPrice))}
                </h2>
                <p className="text-xs text-green-400 font-medium">
                  {selectedVariant?.discountType == 'Unit' ? 
                    `Discounted ${numericConverter(selectedVariant?.discountPrice)}` :
                    `${selectedVariant?.discountPrice}% Off`}
                </p>
              </>
            ) : (
              <h2 className="text-primaryColor text-xl font-bold">
                {numericConverter(selectedVariant?.price)}
              </h2>
            )
          }




          {productDetails?.productVariant.length === 1 ? (
            <></>
          ) : (
            <div className="flex flex-wrap gap-3 mt-4">
              {productDetails?.productVariant.map((variant, key) => (
                <button
                  key={key}
                  onClick={() => variantButton(variant.variantId)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 
                    ${
                      variant.variantId === selectedVariant?.variantId
                        ? "bg-primaryColor text-tertiaryColor"
                        : "border border-secondary text-primaryColor hover:bg-primaryColor/10"
                    }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
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
              src={`/product/${selectedImage}`}
              alt={productDetails?.productName || "Product"}
              fill
              className="object-contain rounded-lg"
            />
          )}
        </div>

        {imageOption?.length !== 1 ? (
          <div className="flex gap-3 justify-center flex-wrap">
            {imageOption?.map((img, idx) => (
              <motion.button
                key={img.productimageId ?? idx}
                onClick={() => setSelectedImage(img.url)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 + 0.5 }}
                className={`relative w-24 h-24 border rounded-md overflow-hidden transition 
                  ${
                    selectedImage === img.url
                      ? "border-primaryColor ring-2 ring-primaryColor"
                      : "border-gray-300"
                  }`}
              >
                <Image
                  src={`/product/${img.url}`}
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