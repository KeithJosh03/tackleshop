"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { worksans } from "@/types/fonts";
import { ProductProps, ProductVariant, ProductImage } from "@/types/dataprops";
import { motion } from "framer-motion";

export default function Product() {
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedVariant, setVariant] = useState<ProductVariant>();
  const [selectedPrice, setPrice] = useState<number>();
  const [productDetails, setProductDetail] = useState<ProductProps>();
  const [imageOption, setImageOption] = useState<ProductImage[]>();

  const params = useParams<{ productId: string; productName: string }>();
  const productId = params.productId;

  useEffect(() => {
    if (!productId) return;
    axios
      .get(`/api/products/productdetail/${productId}`)
      .then((res) => {
        const detail = res.data.productdetail;

        setProductDetail(detail);

        const firstVariant = detail.product_variant[0];
        setVariant(firstVariant);

        const mainImage = firstVariant.all_image.find(
          (img: ProductImage) => img.isMain === 1
        );

        if (mainImage) {
          setSelectedImage(mainImage.url);
        }
      })
      .catch((err) => console.log(err));
  }, [productId]);

  useEffect(() => {
    if (selectedVariant?.all_image.length !== 0) {
      setImageOption(selectedVariant?.all_image);
    }

    const mainImage = selectedVariant?.all_image.find(
      (img: ProductImage) => img.isMain === 1
    );
    setPrice(selectedVariant?.price);

    if (mainImage) {
      setSelectedImage(mainImage.url);
    }
  }, [selectedVariant]);

  let variantButton = (paramsId: number) => {
    if (!productDetails) return;

    const foundVariant = productDetails.product_variant.find(
      (detail: ProductVariant) => detail.variant_id === paramsId
    );

    if (foundVariant) {
      setVariant(foundVariant);
    }
  };

  return (
    <>
      {/* LEFT SIDE - PRODUCT DETAILS */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`flex flex-col ${worksans.className} px-10 gap-y-8`}
      >
        <div className="container flex flex-col gap-y-1">
          <h4 className="text-tertiaryColor font-bold">
            {productDetails?.brand.brand_name.toUpperCase()}
          </h4>
          <h1 className="text-primaryColor text-4xl font-bold">
            {productDetails?.product_name}
          </h1>
          <h2 className="text-tertiaryColor text-xl font-bold">
            ₱ {selectedVariant?.price} PHP
          </h2>
          {productDetails?.categorytype.type_name && (
            <h3 className="text-secondary text-lg font-bold">
              {productDetails?.categorytype.type_name}
            </h3>
          )}
          {productDetails?.product_variant.length === 1 ? (
            <></>
          ) : (
            <div className="flex flex-wrap gap-3 mt-4">
              {productDetails?.product_variant.map((variant, key) => (
                <button
                  key={key}
                  onClick={() => variantButton(variant.variant_id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 
                    ${
                      variant.variant_id === selectedVariant?.variant_id
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
        <div className="container flex flex-col text-tertiaryColor text-base text-md font-bold gap-y-10">
          <div className="text-primaryColor">
            {productDetails?.description && (
              <h3 className="text-tertiaryColor text-lg">Description</h3>
            )}
            <p>{productDetails?.description}</p>
          </div>
          <div className="flex flex-col font-bold gap-y-4">
            <div className="text-primaryColor">
              {productDetails?.features.length !== 0 ? (
                <h3 className="text-tertiaryColor">Features</h3>
              ) : (
                <></>
              )}
              {productDetails?.features.map(({ features, feature_id }) => (
                <p key={feature_id}>{features}</p>
              ))}
            </div>
            <div className="text-primaryColor">
              {productDetails?.specification.length !== 0 ? (
                <h3 className="text-tertiaryColor">Specification</h3>
              ) : (
                <> </>
              )}
              {productDetails?.specification.map(
                ({ specs_name, specs_value }, key) => (
                  <p key={key}>{`${specs_name}: ${specs_value}`}</p>
                )
              )}
            </div>
          </div>
        </div>
        <h3 className="text-primaryColor text-2xl font-bold">
          Click "Message Us" to inquiry this item
        </h3>
      </motion.div>

      {/* RIGHT SIDE - IMAGES */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col items-center px-10 gap-4"
      >
        <div className="w-full max-w-[600px] h-[500px] relative">
          {selectedImage && (
            <Image
              src={`/product${selectedImage}`}
              alt={productDetails?.product_name || "Product"}
              fill
              className="object-contain rounded-lg"
            />
          )}
        </div>

        {imageOption && (
          <div className="flex gap-3 justify-center flex-wrap">
            {imageOption.map((img, idx) => (
              <motion.button
                key={img.productImg_id ?? idx}
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
        )}
      </motion.div>
    </>
  );
}
