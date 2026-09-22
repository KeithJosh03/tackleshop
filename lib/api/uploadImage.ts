import { UploadImageProps, UploadedImageProps } from './productService';
import { getSession } from 'next-auth/react';

export const uploadImages = async (
    images: UploadImageProps[]
): Promise<UploadedImageProps[]> => {
    if (!images || images.length === 0) {
        return [];
    }

    // Retrieve active NextAuth session
    const session = await getSession();

    // Safely extract accessToken using type assertion matching next-auth.d.ts
    const token = (session as { accessToken?: string } | null)?.accessToken;

    const formData = new FormData();
    images.forEach((img, index) => {
        formData.append(`files[${index}]`, img.file);
        formData.append(`originIndex[${index}]`, img.originIndex.toString());
    });

    try {
        const response = await fetch('/api/imageupload/uploads', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: formData,
        });

        const rawText = await response.text();

        if (!response.ok) {
            console.error('Laravel Error Response:', rawText);
            throw new Error(`Upload failed with status ${response.status}`);
        }

        try {
            const data = JSON.parse(rawText);
            return data.files as UploadedImageProps[];
        } catch (e) {
            console.error('Laravel returned non-JSON response:', rawText);
            throw new Error('Server returned HTML/Invalid output. Check console for details.');
        }
    } catch (error) {
        console.error('Image Upload Error:', error);
        throw error;
    }
};