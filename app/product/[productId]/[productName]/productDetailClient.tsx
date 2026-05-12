'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { inter } from "@/types/fonts";
import { motion, AnimatePresence } from "framer-motion";
import { numericConverter } from "@/utils/priceUtils";
import { buildProductImages, UIProductImage } from "@/utils/productMedia.UI";
import { ChevronDown, Info, Settings, FileText } from "lucide-react";

import {
  ProductDetailsShow,
  VariantOptionsShow,
} from "@/lib/api/productService";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function ProductDetailClient({
  productDetailProps,
}: {
  productDetailProps: ProductDetailsShow;
}) {
  const [productDetails] = useState<ProductDetailsShow>(productDetailProps);
  const [productImages, setProductImages] = useState<UIProductImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedVariantOption, setSelectedVariantOption] = useState<VariantOptionsShow | null>(null);
  const [openSection, setOpenSection] = useState<string | null>('description');

  useEffect(() => {
    if (!productDetails) return;

    const images = buildProductImages(productDetails);
    setProductImages(images);

    // Priority: product main → first product image → first variant image
    const defaultImage =
      images.find((img) => img.source === 'product' && img.isMain) ??
      images.find((img) => img.source === 'product') ??
      images.find((img) => img.source === 'variant') ??
      images[0];

    setSelectedImageId(defaultImage?.id ?? null);
  }, [productDetails]);

  const handleSelectVariantOption = (option: VariantOptionsShow) => {
    setSelectedVariantOption(option);

    // Only swap image if this variant option actually has one
    const uiImage = productImages.find(
      (img) => img.source === 'variant' && img.id === `variant-${option.variantOptionId}`
    );
    if (uiImage) setSelectedImageId(uiImage.id);
  };

  const displayPrice = (): string => {
    if (!productDetails) return '0.00';
    const base = parseFloat(productDetails.basePrice) || 0;
    const adj = selectedVariantOption
      ? parseFloat(selectedVariantOption.variantOptionPrice) || 0
      : 0;
    return (base + adj).toFixed(2);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const currentImage = productImages.find((img) => img.id === selectedImageId);

  return (
    <div className="mx-auto px-10 md:px-16 lg:px-20 xl:px-28 py-10 max-w-6xl w-full">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

        {/* ─── LEFT COLUMN: Info ─── */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8 lg:sticky lg:top-8">

          {/* Brand / Category crumb */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <span className="text-primaryColor font-bold tracking-widest text-xs uppercase bg-primaryColor/10 px-3 py-1 rounded-md">
              {productDetails?.brandName}
            </span>
            <span className="w-1 h-1 rounded-full bg-greyColor" />
            <span className="text-secondary text-sm font-medium">
              {productDetails?.subCategoryName}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-tertiaryColor text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight"
          >
            {productDetails?.productTitle}
          </motion.h1>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={`text-3xl md:text-4xl font-black text-primaryColor ${inter.className}`}
          >
            {numericConverter(displayPrice())}
          </motion.div>

          {/* Divider */}
          <hr className="border-greyColor/30" />

          {/* Variants */}
          {productDetails?.productVariants && productDetails.productVariants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              {productDetails.productVariants.map((variant, vi) => (
                <div key={vi} className="flex flex-col gap-3">
                  <p className="text-tertiaryColor/60 text-xs font-semibold tracking-[0.2em] uppercase">
                    Select {variant.variantTypeName}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {variant.variantOptions.map((option, oi) => {
                      const isSelected =
                        option.variantOptionId === selectedVariantOption?.variantOptionId;
                      const hasImage = productImages.some(
                        (img) =>
                          img.source === 'variant' &&
                          img.id === `variant-${option.variantOptionId}`
                      );

                      return (
                        <button
                          key={oi}
                          onClick={() => handleSelectVariantOption(option)}
                          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group
                            ${isSelected
                              ? 'bg-primaryColor text-white shadow-[0_0_18px_rgba(232,147,71,0.45)] scale-105 border-transparent'
                              : 'bg-blackgroundColor/50 text-tertiaryColor/80 border border-greyColor/40 hover:border-primaryColor hover:text-tertiaryColor'
                            }`}
                        >
                          {!isSelected && (
                            <div className="absolute inset-0 bg-primaryColor/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                          {/* Small image preview badge only for options that have an image */}
                          {hasImage && (
                            <span className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-white/30">
                              <Image
                                src={`${baseURL}${productImages.find(
                                  (img) => img.id === `variant-${option.variantOptionId}`
                                )?.imageUrl}`}
                                alt={option.variantOptionValue}
                                fill
                                sizes="20px"
                                className="object-cover"
                              />
                            </span>
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

          {/* Divider */}
          <hr className="border-greyColor/30" />

          {/* Accordions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            {[
              { id: 'description', label: 'Description', icon: FileText, content: productDetails?.description },
              { id: 'features', label: 'Features', icon: Settings, content: productDetails?.features },
              { id: 'specifications', label: 'Specifications', icon: Info, content: productDetails?.specifications },
            ].map(
              (section) =>
                section.content && (
                  <div
                    key={section.id}
                    className="border border-greyColor/25 rounded-2xl bg-blackgroundColor/20 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-primaryColor/30"
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-tertiaryColor font-bold text-sm tracking-wide">
                        <section.icon className="w-4 h-4 text-primaryColor" />
                        {section.label}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-greyColor transition-transform duration-300 ${openSection === section.id ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-5 pt-0 text-tertiaryColor/80 text-sm leading-relaxed whitespace-pre-line border-t border-greyColor/20 pt-4">
                            {section.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
            )}
          </motion.div>
        </div>

        {/* ─── RIGHT COLUMN: Image Gallery ─── */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5 lg:sticky lg:top-8">

          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-[3/4] bg-blackgroundColor/40 backdrop-blur-md rounded-3xl border border-greyColor/40 overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.35)]"
          >
            <AnimatePresence mode="wait">
              {currentImage ? (
                <motion.div
                  key={currentImage.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-full h-full p-6"
                >
                  <Image
                    src={`${baseURL}${currentImage.imageUrl}`}
                    alt={productDetails?.productTitle || 'Product Image'}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              ) : (
                <div className="text-greyColor/40 text-sm">No image available</div>
              )}
            </AnimatePresence>

            {/* Source badge */}
            {currentImage && (
              <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest bg-blackgroundColor/60 backdrop-blur px-2.5 py-1 rounded-full text-greyColor/70 border border-greyColor/20">
                {currentImage.source === 'variant' ? 'Variant' : 'Product'}
              </span>
            )}
          </motion.div>

          {/* Thumbnail Strip */}
          {productImages.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex gap-3 overflow-x-auto py-1 custom-scrollbar snap-x"
            >
              {productImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageId(img.id)}
                  className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden transition-all duration-300 snap-center
                    ${selectedImageId === img.id
                      ? 'ring-2 ring-primaryColor ring-offset-2 ring-offset-mainBackgroundColor scale-105 opacity-100 shadow-[0_0_12px_rgba(232,147,71,0.4)]'
                      : 'border border-greyColor/40 opacity-55 hover:opacity-100 hover:border-primaryColor/50'
                    }`}
                >
                  <div className="absolute inset-0 bg-blackgroundColor/40 backdrop-blur-sm z-0" />
                  <Image
                    src={`${baseURL}${img.imageUrl}`}
                    alt="Thumbnail"
                    fill
                    sizes="96px"
                    loading="lazy"
                    className="object-cover z-10"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
