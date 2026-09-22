"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';

type ImageUploadProps = {
    uploadImage?: string;
    imageAlt?: string;
    className?: string;
    maxImages: number;
    onFileChange: (files: File | File[]) => void;
    children?: React.ReactNode;
};

const FileDropImage: React.FC<ImageUploadProps> = ({
    onFileChange,
    uploadImage,
    imageAlt = "Upload Image",
    maxImages,
    className,
    children
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const filesArray = Array.from(files);

        if (filesArray.length > maxImages) {
            return;
        }

        if (maxImages === 1) {
            onFileChange(filesArray[0]);
        } else {
            onFileChange(filesArray);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const onClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={onClick}
            className={className || `cursor-pointer w-16 h-16 border-2 border-dashed ${isDragging ? 'border-primaryColor bg-primaryColor/10' : 'border-secondary hover:border-primaryColor'} p-2 rounded-2xl text-center items-center justify-center flex transition-colors`}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple={maxImages > 1}
                accept="image/*"
            />
            {children ? children : (
                <div className="flex flex-col items-center relative w-8 h-8 pointer-events-none">
                    {uploadImage && (
                        <Image
                            src={uploadImage}
                            alt={imageAlt}
                            fill
                            className="mb-2 object-contain"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default FileDropImage;