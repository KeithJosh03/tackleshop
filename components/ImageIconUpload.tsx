import React from 'react';
import Image from 'next/image';

type ImageUploadProps = {
  onFileChange: (file: File) => void;
  uploadImage: string;
  imageAlt?: string;
  className?: string;
};

const ImageIconUpload: React.FC<ImageUploadProps> = ({
  onFileChange,
  uploadImage,
  imageAlt = 'Upload Image',
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileChange(e.target.files[0]);
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
