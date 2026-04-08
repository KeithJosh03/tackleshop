'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { inter } from "@/types/fonts";
import { motion, AnimatePresence } from "framer-motion";
import { numericConverter } from "@/utils/priceUtils";
import { buildProductImages, UIProductImage } from "@/utils/productMedia.UI";
import { ChevronDown, MessageCircle, Info, Settings, FileText } from "lucide-react";

import {
  ProductDetailsShow,
  VariantOptionsShow
} from "@/lib/api/productService";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function ProductDetailClient({ productDetailProps }: { productDetailProps: ProductDetailsShow }) {
  const [productDetails] = useState<ProductDetailsShow>(productDetailProps);
  const [productImages, setProductImages] = useState<UIProductImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedVariantOption, setSelectedVariantOption] = useState<VariantOptionsShow | null>(null);

  // Accordion state - default open is description
  const [openSection, setOpenSection] = useState<string | null>('description');

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

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const currentImage = productImages.find(img => img.id === selectedImageId);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-[90rem] flex flex-col gap-12">

      {/* Top Section: Header & Image Gallery Centered */}
      <div className="flex flex-col items-center text-center gap-8">

        {/* Header Info Centered */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 w-full max-w-4xl"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-primaryColor font-bold tracking-widest text-sm md:text-base uppercase bg-primaryColor/10 px-4 py-1.5 rounded-md">
              {productDetails?.brandName}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-greyColor"></span>
            <span className="text-secondary font-medium text-sm md:text-base">
              {productDetails?.subCategoryName}
            </span>
          </div>

          <h1 className="text-tertiaryColor text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            {productDetails?.productTitle}
          </h1>

          <div className="mt-2 text-3xl md:text-4xl lg:text-5xl font-black text-primaryColor flex items-center justify-center gap-2">
            <span className={`${inter.className}`}>
              {numericConverter(String(selectedVariantOption ? baseAndVariantSumPrice() : productDetails?.basePrice))}
            </span>
          </div>
        </motion.div>

        {/* Huge Centered Image Gallery */}
        <div className="w-full flex flex-col items-center gap-6 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] bg-blackgroundColor/40 backdrop-blur-md rounded-3xl border border-greyColor/50 overflow-hidden flex items-center justify-center p-4 lg:p-12 shadow-[0_0_40px_rgba(0,0,0,0.3)]"
          >
            <AnimatePresence mode="wait">
              {currentImage && (
                <motion.div
                  key={currentImage.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={`${baseURL}${currentImage.imageUrl}`}
                    alt={productDetails?.productTitle || "Product Image"}
                    fill
                    sizes="(max-width: 1280px) 100vw, 80vw"
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Thumbnail Gallery Centered */}
          {productImages.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-4 overflow-x-auto py-4 custom-scrollbar snap-x justify-start md:justify-center w-full max-w-5xl"
            >
              {productImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageId(img.id)}
                  className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden transition-all duration-300 snap-center
                    ${selectedImageId === img.id
                      ? "ring-2 ring-primaryColor ring-offset-4 ring-offset-mainBackgroundColor border-transparent opacity-100 scale-105 shadow-[0_0_15px_rgba(232,147,71,0.5)]"
                      : "border border-greyColor/50 opacity-60 hover:opacity-100 hover:border-primaryColor/50"
                    }`}
                >
                  <div className="absolute inset-0 bg-blackgroundColor/40 backdrop-blur-sm z-0" />
                  <Image
                    src={`${baseURL}${img.imageUrl || '/placeholder.png'}`}
                    alt="Thumbnail"
                    fill
                    sizes="96px"
                    loading="lazy"
                    decoding="async"
                    className="object-cover z-10"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <hr className="border-greyColor/30 w-full max-w-5xl mx-auto" />

      {/* Bottom Section: Details & Action */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">

        {/* Variants - Centered */}
        {productDetails?.productVariants && productDetails.productVariants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-8 items-center"
          >
            {productDetails.productVariants.map((variant, index) => (
              <div key={index} className="flex flex-col items-center gap-5 w-full">
                <h3 className="font-semibold text-tertiaryColor text-sm md:text-base tracking-[0.2em] uppercase">
                  Select {variant.variantTypeName}
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {variant.variantOptions.map((option, idx) => {
                    const isSelected = option.variantOptionId === selectedVariantOption?.variantOptionId;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectVariantOption(option)}
                        className={`relative px-8 py-3 rounded-xl text-base font-semibold transition-all duration-300 overflow-hidden group
                          ${isSelected
                            ? "bg-primaryColor text-white shadow-[0_0_20px_rgba(232,147,71,0.5)] border-transparent scale-105"
                            : "bg-blackgroundColor/50 text-tertiaryColor/80 border border-greyColor/50 hover:border-primaryColor hover:text-tertiaryColor"
                          }`}
                      >
                        {!isSelected && (
                          <div className="absolute inset-0 bg-primaryColor/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        <span className="relative z-10">{option.variantOptionValue}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Product Information Accordions - Full Width of container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col gap-4 mt-4"
        >
          {[
            { id: 'description', label: 'Description', icon: FileText, content: productDetails?.description },
            { id: 'features', label: 'Features', icon: Settings, content: productDetails?.features },
            { id: 'specifications', label: 'Specifications', icon: Info, content: productDetails?.specifications }
          ].map((section) => section.content && (
            <div key={section.id} className="border border-greyColor/30 rounded-2xl bg-blackgroundColor/20 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-primaryColor/30">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4 text-tertiaryColor font-bold text-lg tracking-wide">
                  <section.icon className="w-6 h-6 text-primaryColor" />
                  {section.label}
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-greyColor transition-transform duration-300 ${openSection === section.id ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-tertiaryColor/90 text-base leading-relaxed whitespace-pre-line">
                      <div className="border-t border-greyColor/20 pt-6 mt-2">
                        {section.content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
