'use client';

import React, { Dispatch, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { ProductFormState, ProductFormAction, FormMedia } from '@/lib/reducer/productFormReducer';
import FileDropImage from '../ui/FileDropImage';

interface ProductMediaProps {
    ProductDetailState: ProductFormState;
    dispatchProductDetailCreate: Dispatch<ProductFormAction>;
    errors?: Record<string, string>;
}

export default function ProductMedia({
    ProductDetailState,
    dispatchProductDetailCreate,
    errors = {},
}: ProductMediaProps) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

    const mediaPreviews = useMemo(() => {
        return ProductDetailState.medias.map((media) => {
            if (!media.file) return { src: '', name: 'Image', isBlob: false };

            if (media.file instanceof File) {
                return {
                    src: URL.createObjectURL(media.file),
                    name: media.file.name,
                    isBlob: true,
                };
            }

            if (typeof media.file === 'string') {
                const filePath = media.file as string;
                const isAbsolute =
                    filePath.startsWith('http://') ||
                    filePath.startsWith('https://') ||
                    filePath.startsWith('blob:');
                return {
                    src: isAbsolute ? filePath : `${baseURL}${filePath.startsWith('/') ? '' : '/'}${filePath}`,
                    name: filePath.split('/').pop() || 'Existing Image',
                    isBlob: false,
                };
            }

            return { src: '', name: 'Image', isBlob: false };
        });
    }, [ProductDetailState.medias, baseURL]);

    useEffect(() => {
        return () => {
            mediaPreviews.forEach((preview) => {
                if (preview.isBlob && preview.src) {
                    URL.revokeObjectURL(preview.src);
                }
            });
        };
    }, [mediaPreviews]);

    return (
        <div className="lg:col-span-3">
            {errors.media && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">
                    {errors.media}
                </div>
            )}

            <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-normal text-[#a6a7a6]">
                    ({ProductDetailState.medias.length} items uploaded)
                </span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                <FileDropImage
                    maxImages={20}
                    className="shrink-0 w-64 h-72 border-2 border-dashed border-[#2c3542] rounded-xl bg-[#16202c] flex flex-col items-center justify-center p-6 text-center hover:border-[#a18d7f]/40 transition-colors cursor-pointer group"
                    onFileChange={(files: File | File[]) => {
                        const fileArray = Array.isArray(files) ? files : [files];
                        if (fileArray.length > 0) {
                            const newMedias: FormMedia[] = fileArray.map((file, idx) => ({
                                id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${idx}`,
                                file,
                                isMain: false,
                            }));

                            if (ProductDetailState.medias.length === 0) {
                                newMedias[0].isMain = true;
                            }

                            dispatchProductDetailCreate({ type: 'ADD_MEDIAS', payload: newMedias });
                        }
                    }}
                >
                    <UploadCloud className="w-8 h-8 text-[#a6a7a6] mb-4 group-hover:text-[#d9e3f4] transition-colors" />
                    <div className="text-sm font-medium text-[#d9e3f4] mb-1">
                        Drag & drop or <span className="text-[#ffb77c] hover:underline">browse</span> files
                    </div>
                    <div className="text-xs text-[#a6a7a6] leading-relaxed">
                        PNG, JPG, WEBP up to<br />10MB. Ideal ratio 1:1.
                    </div>
                </FileDropImage>

                {ProductDetailState.medias.map((media, index) => {
                    const preview = mediaPreviews[index];

                    return (
                        <div
                            key={media.id || preview.src || index}
                            className={`shrink-0 w-64 h-72 rounded-xl bg-[#16202c] border ${media.isMain
                                ? 'border-[#ffb77c]/50 shadow-[0_0_15px_rgba(255,183,124,0.1)]'
                                : 'border-[#212b37]'
                                } overflow-hidden flex flex-col relative group`}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    dispatchProductDetailCreate({ type: 'REMOVE_MEDIA', payload: media.id })
                                }
                                className="absolute top-2 right-2 w-6 h-6 bg-[#2e1a1a] border border-[#ffb4ab]/30 text-[#ffb4ab] rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-10"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            <div className="h-44 bg-black/30 relative">
                                {preview.src && (
                                    <Image
                                        src={preview.src}
                                        alt={`Media ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        unoptimized={preview.isBlob}
                                    />
                                )}
                            </div>

                            <div
                                className={`p-3.5 flex flex-col flex-1 border-t ${media.isMain ? 'border-[#ffb77c]/30' : 'border-[#212b37]'
                                    }`}
                            >
                                <div
                                    className="flex items-center gap-2 mb-2 cursor-pointer group/radio"
                                    onClick={() =>
                                        dispatchProductDetailCreate({ type: 'SET_MAIN_MEDIA', payload: media.id })
                                    }
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full border ${media.isMain
                                            ? 'border-4 border-[#ffb77c] bg-[#16202c]'
                                            : 'border-[#2c3542] bg-transparent group-hover/radio:border-[#a18d7f]/40 transition-colors'
                                            }`}
                                    />
                                    <span
                                        className={`text-[10px] font-bold tracking-wider transition-colors ${media.isMain
                                            ? 'text-[#ffb77c]'
                                            : 'text-[#a6a7a6] group-hover/radio:text-[#d9e3f4]'
                                            }`}
                                    >
                                        {media.isMain ? 'MAIN COVER' : 'SET AS COVER'}
                                    </span>
                                </div>

                                <div className="text-xs text-[#d9e3f4] truncate px-2 py-1.5 bg-[#121c28] border border-[#2c3542] rounded mt-1">
                                    {preview.name}
                                </div>
                                <div className="mt-auto text-[10px] text-[#a6a7a6] font-mono">{index + 1}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}