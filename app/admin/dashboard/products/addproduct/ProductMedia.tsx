import IconButton from "@/components/IconButton";
import Image from "next/image";
import ImageIconUpload from "@/components/ImageIconUpload";

import { ProductDetailAction } from "./page";

interface ProductImage {
  file: File;
  isMain: boolean;
}

interface MediaComponentProps {
  medias: ProductImage[];
  dispatchProductDetail: React.Dispatch<ProductDetailAction>;
}

const ProductMedia: React.FC<MediaComponentProps> = ({
  medias,
  dispatchProductDetail,
}) => {
const addProductMedia = (files: File[]) => {
  const productImages = files.map((file) => ({
    file,      
    isMain: false,
  }));
  dispatchProductDetail({
    type: "ADD_MEDIAS",
    payload: productImages,
  });
};

  const setMainImage = (index: number) => {
    dispatchProductDetail({
      type: "SELECT_PRODUCT_IMAGE_THUMBNAIL", 
      payload: index,
    });
  };

  const deleteImage = (index: number) => {
    dispatchProductDetail({
      type: "DELETE_PRODUCT_IMAGE", 
      payload: index,
    });
  };

  return (
    <div className="flex flex-col gap-x-4 p-2 font-extrabold rounded border border-greyColor bg-mainBackgroundColor">
      <div className="flex flex-col justify-between justify-items-center p-2 gap-x-4">
        <div>
          <h3 className="text-2xl text-primaryColor font-extrabold">Media</h3>
          <p className="text-sm text-secondary">A media is required</p>
        </div>

        <div className="grid grid-cols-3 content-between">
          <div className="col-span-2">
            {medias.length > 0 && (
              <div className="flex flex-row gap-3 p-4 h-40 items-center justify-items-center overflow-x-auto overflow-y-hidden snap-x snap-mandatory custom-scrollbar">
                {medias.map((media, index) => (
                  <div
                    key={index}
                    className={`relative min-w-[160px] h-40 w-40 rounded border ${
                      media.isMain ? "border-primaryColor" : "border-greyColor"
                    }`}
                    onClick={() => setMainImage(index)} 
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <IconButton
                        icon="/icons/closeicon.svg"
                        altText="Delete Icon"
                        iconSize={8}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(index);
                        }}
                      />
                    </div>
                    <Image
                      src={URL.createObjectURL(media.file)}
                      alt={`media-${index}`}
                      fill
                      className="object-contain rounded"
                    />
                    {media.isMain && (
                      <div className="absolute top-2 left-2 bg-primaryColor text-white text-xs font-bold p-1 rounded">
                        Main
                      </div>  
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-1 items-end">
            <div className="relative h-40 w-40 p-2 border border-secondary hover:border-primaryColor rounded group flex flex-col items-center text-center justify-center justify-items-center">
              <ImageIconUpload
                uploadImage="/icons/imageupload.svg"
                maxImages={9}
                onFileChange={(file: File[]) => {
                  addProductMedia(file);
                }}
              />
              <h1 className="text-secondary group-hover:text-primaryColor">
                Select Image
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMedia;
