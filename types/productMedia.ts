export interface ProductMedias {
    mediaId?: number;
    imageId?: string;
    url?: string;
    mediaUrl?: string;
    imageUrl?: string;
    file?: File | string | null;
    isMain: boolean;
    is_main?: boolean;
}