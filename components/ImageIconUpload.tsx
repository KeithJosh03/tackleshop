import React from 'react';
import Image from 'next/image';

type ImageUploadProps = {
  uploadImage: string;
  imageAlt?: string;
  className?: string;
  maxImages: number;
  onFileChange: ((file: File) => void) | ((files: File[]) => void);
};



const ImageIconUpload: React.FC<ImageUploadProps> = ({
  onFileChange,
  uploadImage,
  imageAlt = "Upload Image",
  maxImages
}) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    if (filesArray.length > maxImages) {
      return;
    }

    if (maxImages === 1) {
      (onFileChange as (file: File) => void)(filesArray[0]);
    } 
    else {
      (onFileChange as (files: File[]) => void)(filesArray);
    }
  };

  return (
    <label 
    className='cursor-pointer w-16 h-16 border-2 border-dashed border-secondary p-2 rounded-2xl text-center items-center justify-center flex group-hover:border-primaryColor hover:text-primaryColor'
    >
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        multiple={maxImages > 1}
      />
      <div className="flex flex-col items-center relative w-8 h-8">
        <Image
          src={uploadImage}
          alt={imageAlt}
          fill
          className="mb-2 object-contain"
        />
      </div>
    </label>
  );
};

export default ImageIconUpload;


