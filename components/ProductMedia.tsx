'use client';

import { useState } from "react";
import IconButton from "@/components/ui/IconButton";
import Image from "next/image";
import ImageIconUpload from "@/components/ui/ImageIconUpload";

import { ProductMedias } from "@/types/productMedia";

// ACTIONS
import { ProductDetailActionCreate } from "@/lib/reducer/productReducer";
import { ProductDetailActionEdit } from "@/lib/reducer/editProductReducer";

interface ProductImage {
  file: File;
  isMain: boolean;
}

type ReducerType = 'CREATE' | 'EDIT'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

interface MediaComponentProps {
  productMedias?: ProductImage[];
  currentMedias?: ProductMedias[] | null;
  dispatchProductDetailCreate?: React.Dispatch<ProductDetailActionCreate>;
  ProductDetailEditReducer?: React.Dispatch<ProductDetailActionEdit>;
  ReducerType: ReducerType;
}

const ProductMedia: React.FC<MediaComponentProps> = ({
  currentMedias,
  productMedias,
  ReducerType,
  dispatchProductDetailCreate,
  ProductDetailEditReducer
}) => {

  const handleAddProductMedia = (files: File[]) => {
    if (ReducerType === 'CREATE' && dispatchProductDetailCreate) {
      const productImages = files.map((file, i) => ({
        file,
        isMain: (productMedias?.length === 0 && i === 0) ? true : false,
      }));
      dispatchProductDetailCreate({
        type: "ADD_MEDIAS",
        payload: productImages,
      });
    }
    if (ReducerType === 'EDIT' && ProductDetailEditReducer) {
      ProductDetailEditReducer({
        type: "ADD_MEDIAS_EDIT",
        payload: files,
      });
    }
  };

  const handleSetMainImage = (index: number) => {
    if (ReducerType === 'CREATE' && dispatchProductDetailCreate) {
      dispatchProductDetailCreate({ type: "SELECT_PRODUCT_IMAGE_THUMBNAIL", payload: index });
    }
    if (ReducerType === 'EDIT' && ProductDetailEditReducer) {
      ProductDetailEditReducer({ type: "UPDATE_MEDIA_MAIN_EDIT", payload: index });
    }
  }

  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      if (ReducerType === 'CREATE' && dispatchProductDetailCreate) {
        dispatchProductDetailCreate({ type: "DELETE_PRODUCT_IMAGE", payload: itemToDelete });
      }
      if (ReducerType === 'EDIT' && ProductDetailEditReducer) {
        ProductDetailEditReducer({ type: 'REMOVE_MEDIA', payload: itemToDelete });
      }
      setItemToDelete(null);
    }
  }

  const handleDeleteProductMedia = (index: number) => {
    setItemToDelete(index);
  }

  const isCreate = ReducerType === 'CREATE';
  const isEdit = ReducerType === 'EDIT';

  // Unified rendering logic based on mode
  const renderMedias = isCreate
    ? (productMedias || [])
    : (currentMedias || []);

  const totalImages = renderMedias.length;

  return (
    <div className="flex flex-col gap-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-primaryColor uppercase tracking-widest">Product Gallery</h3>
          <p className="text-sm text-secondary mt-1 font-medium">
            Upload high-resolution images. The first uploaded image will be your main thumbnail.
          </p>
        </div>
        <div className="text-sm font-bold px-4 py-2 rounded-lg border border-greyColor text-secondary" style={{ background: 'rgba(17,26,45,0.7)' }}>
          <span className="text-primaryColor tracking-wider">{totalImages}</span> / 20 Images
        </div>
      </div>

      {/* ── Grid Gallery ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

        {/* Upload Button Box */}
        {totalImages < 20 && (
          <div className="relative w-full aspect-[4/5] rounded-xl border-2 border-dashed transition-all hover:bg-primaryColor/5 overflow-hidden group"
            style={{ borderColor: 'rgba(232,147,71,0.3)', background: 'rgba(17,26,45,0.4)' }}>
            <ImageIconUpload
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
              uploadImage="/icons/imageupload.svg"
              maxImages={20 - totalImages}
              onFileChange={(files: File[]) => handleAddProductMedia(files)}
            />
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-bold text-primaryColor uppercase tracking-widest leading-none drop-shadow-md">Upload Photo</span>
            </div>
          </div>
        )}

        {/* Render Image Items */}
        {renderMedias.map((media: any, index: number) => {
          const isMain = media.isMain;
          const imageSrc = media.file
            ? URL.createObjectURL(media.file)
            : `${baseURL}${media.imageUrl}`;
          const itemId = isCreate ? index : media.imageId;

          return (
            <div
              key={itemId}
              className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden group transition-all duration-300 ${isMain ? "border-2 opacity-100 scale-[1.02] shadow-[0_0_15px_rgba(232,147,71,0.3)] z-10" : "border opacity-80 hover:opacity-100 hover:scale-[1.01]"
                }`}
              style={{
                borderColor: isMain ? '#E89347' : '#2A3441',
                background: '#111A2D'
              }}
            >
              <Image
                src={imageSrc}
                alt={`media-${index}`}
                fill
                className="object-contain p-2"
              />

              {/* Main Badge */}
              {isMain && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-primaryColor text-white px-2 py-1 rounded shadow-md z-20">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-[10px] uppercase font-black tracking-wider">Main</span>
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] z-20">

                {!isMain && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetMainImage(itemId);
                    }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors w-3/4 justify-center"
                  >
                    Set as Main
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProductMedia(itemId);
                  }}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors w-3/4 justify-center"
                >
                  Delete
                </button>

              </div>
            </div>
          );
        })}

      </div>

      {/* ── Delete Confirmation Modal ── */}
      {itemToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className="bg-[#111A2D] border border-[#2A3441] rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm transform transition-all"
            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto mb-4 border border-red-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-white text-center tracking-wide">Remove Image</h3>
              <p className="text-secondary text-sm text-center mt-2 leading-relaxed">
                Are you sure you want to remove this image from the gallery? This action cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#2A3441]">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3 text-sm font-bold text-secondary hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                style={{ borderRight: '1px solid #2A3441' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 text-sm font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductMedia;
