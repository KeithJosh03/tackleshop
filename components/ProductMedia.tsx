import IconButton from "@/components/IconButton";
import Image from "next/image";
import ImageIconUpload from "@/components/ImageIconUpload";

import { ProductMedias } from "@/types/productMedia";

// ACTIONS
import { ProductDetailActionCreate } from "../app/admin/dashboard/addproduct/page";
import { ProductDetailActionEdit } from "@/app/admin/dashboard/editproduct/[productId]/ProductClientEdit";


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
  ReducerType:ReducerType;
}



const ProductMedia: React.FC<MediaComponentProps> = ({
  currentMedias,
  productMedias,
  ReducerType,
  dispatchProductDetailCreate,
  ProductDetailEditReducer
}) => {
  
  const handleAddProductMedia = (files: File[]) => {
    if(ReducerType === 'CREATE' && dispatchProductDetailCreate){
      const productImages = files.map((file) => ({
        file,      
        isMain: false,
      }));
      dispatchProductDetailCreate({
        type: "ADD_MEDIAS",
        payload: productImages,
      });
    }
  };




  const handleSetMainImage = (index:number) => {
    if(ReducerType === 'CREATE' && dispatchProductDetailCreate){
      dispatchProductDetailCreate({
        type: "SELECT_PRODUCT_IMAGE_THUMBNAIL", 
        payload: index,
      });
    }

    if(ReducerType === 'EDIT' && ProductDetailEditReducer){
      ProductDetailEditReducer({
        type:"UPDATE_MEDIA_MAIN",
        payload:index
      })
    }
  }

  const handleDeleteProductMedia = (index: number) => {
    if(ReducerType === 'CREATE' && dispatchProductDetailCreate){
      dispatchProductDetailCreate({
        type: "DELETE_PRODUCT_IMAGE", 
        payload: index,
      });
    }
    if(ReducerType === 'EDIT' && ProductDetailEditReducer){
      ProductDetailEditReducer({
        type:'REMOVE_MEDIA',
        payload:index
      })
    }
  }


  return (
    <div className="flex flex-col gap-x-4 p-2 font-extrabold rounded border border-greyColor bg-blackgroundColor">
      <div className="flex flex-col gap-y-2 justify-between justify-items-center p-2 gap-x-4">
        <div>
          <h3 className="text-2xl text-primaryColor font-extrabold">Media</h3>
          <p className="text-sm text-secondary">A media is required</p>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex-1">

            {/* CREATE MEDIA & RENDER LIST */}
            {(productMedias !== null  && ReducerType === 'CREATE' && productMedias !== undefined) && (
              <div className="flex flex-row gap-3 p-4 h-40 items-center justify-items-center overflow-x-auto overflow-y-hidden snap-x snap-mandatory custom-scrollbar">
                {productMedias.map((media, index) => (
                <div
                  key={index}
                  className={`relative min-w-[160px] h-40 w-40 rounded border ${
                    media.isMain ? "border-primaryColor" : "border-greyColor"
                  }`}
                  onClick={() => handleSetMainImage(index)} 
                >
                  <div className="absolute top-2 right-2 z-10">
                    <IconButton
                      icon="/icons/closeicon.svg"
                      altText="Delete Icon"
                      iconSize={8}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProductMedia(index);
                      }}
                    />
                  </div>
                  <Image
                    src={URL.createObjectURL(media.file)}
                    alt={`media-${index}`}
                    fill
                    className="object-contain rounded"
                  />
                  {(media.isMain === true) && (
                    <div className="absolute top-2 left-2 bg-primaryColor text-white text-xs font-bold p-1 rounded">
                      Main
                    </div>  
                  )}
                </div>
                ))}
            </div>
            )}

            {/* EDIT MEDIA & RENDER LIST */}
            {(currentMedias !== null && ReducerType === 'EDIT' && currentMedias !== undefined) && (
              <div className="flex flex-row gap-3 p-4 h-40 items-center justify-items-center overflow-x-auto overflow-y-hidden snap-x snap-mandatory custom-scrollbar">
                {currentMedias.map((media, index) => (
                  <div
                    key={index}
                    className={`relative min-w-[160px] h-40 w-40 rounded border ${
                      media.isMain ? "border-primaryColor" : "border-greyColor"
                    }`}
                    onClick={() => handleSetMainImage(media.productImgId)}
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <IconButton
                        icon="/icons/closeicon.svg"
                        altText="Delete Icon"
                        iconSize={8}
                        onClick={(e) => {
                          handleDeleteProductMedia(media.productImgId)
                        }}
                      />
                    </div>
                    <Image
                      src={`${baseURL}${media.imageUrl}`} 
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
          {ReducerType === 'CREATE' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="relative h-20 w-20 p-2 border border-secondary hover:border-primaryColor rounded group flex flex-col items-center text-center justify-center justify-items-center">
              <ImageIconUpload
                uploadImage="/icons/imageupload.svg"
                maxImages={9}
                onFileChange={(file: File[]) => {
                  handleAddProductMedia(file);
                }}
              />
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductMedia;
