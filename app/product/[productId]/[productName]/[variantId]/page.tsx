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
  const params = useParams<{ productId: string; variantId: string }>();
  const productId = Number(params.productId);
  const variantId = Number(params.variantId);

  const [productDetails, setProductDetail] = useState<ProductDetailsProps>();
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedVariant, setVariant] = useState<ProductDetailVariantProps>();
  const [selectedPrice, setPrice] = useState<number>();
  const [imageOption, setImageOption] = useState<ProductDetailImageProps[]>();

  
  useEffect(() => {
  axios
      .get<ProductDetailsPropsResponse>(`/api/products/productdetail/${params.productId}`)
      .then((res) => {
      const detail = res.data.productdetail;

      setProductDetail(detail);
      })
      .catch((err) => console.log(err));
  }, [params.productId]);


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

    setPrice(Number(selectedVariant.price));
  }, [selectedVariant, productDetails?.productVariant]);


  const variantButton = (variantId: number) => {
    if (!productDetails) return;

    window.history.replaceState(
      null,
      "",
      `/product/${productId}/${slugify(productDetails.productName.toLowerCase() ?? "unknown")}/${variantId}`
    );

    const foundVariant = productDetails.productVariant.find(
      (variant) => variant.variantId === variantId
    );
    if (foundVariant) {
      setVariant(foundVariant);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`flex flex-col ${worksans.className} px-10 gap-y-2`}
      >
        <div className="container flex flex-col gap-y-1">
          <h4 className="text-tertiaryColor font-bold">
            {productDetails?.brandName.toUpperCase()}
          </h4>
          <h1 className="text-primaryColor text-4xl font-bold">
            {productDetails?.productName}
          </h1>
          <h2 className="text-tertiaryColor text-xl font-bold">
            ₱ {selectedVariant?.price} PHP
          </h2>
          {productDetails?.typeName && (
            <h3 className="text-secondary text-lg font-bold">
              {productDetails?.typeName}
            </h3>
          )}
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
        <div className="container flex flex-col text-primaryColor text-base font-semibold gap-y-4">
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
              src={`/product${selectedImage}`}
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
                  src={`/product${img.url}`}
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