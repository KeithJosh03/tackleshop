import axios from 'axios';
import { UploadImageProps, UploadedImageProps } from './productService';

export const uploadImages = async (
    images: UploadImageProps[]
): Promise<UploadedImageProps[]> => {
    if (!images || images.length === 0) {
        return [];
    }

    const formData = new FormData();

    images.forEach((img, index) => {
        formData.append(`files[${index}]`, img.file);
        formData.append(`originIndex[${index}]`, img.originIndex.toString());
    });

    try {
        const response = await axios.post('/api/imageupload/uploads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.files as UploadedImageProps[];
    } catch (error) {
        console.error('Image Upload Error:', error);
        throw error;
    }
};
