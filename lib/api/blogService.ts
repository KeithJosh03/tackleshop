import { apiClient } from './apiClient';

export interface TaggedProduct {
    id: number;
    title: string;
    price: string;
    image: string | null;
}

export interface BlogImage {
    url: string;
    is_main: boolean;
}

export interface BlogPost {
    id: number;
    user: {
        id: number;
        name: string;
        email?: string | null;
        avatar?: string | null;
    };
    title: string;
    location?: string | null;
    caption_html: string;
    likes_count: number;
    is_liked: boolean;
    created_at: string;
    images: BlogImage[];
    tagged_products: TaggedProduct[];
}

export interface BlogResponse {
    blogs: BlogPost[];
    current_page: number;
    last_page: number;
}

export const fetchBlogs = async (page = 1): Promise<BlogResponse | null> => {
    try {
        return await apiClient<BlogResponse>(`/api/blogs?page=${page}`, {
            method: 'GET',
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return null;
    }
};

export const fetchBlogById = async (id: string | number): Promise<{ blog: BlogPost } | null> => {
    try {
        return await apiClient<{ blog: BlogPost }>(`/api/blogs/${id}`, {
            method: 'GET',
        });
    } catch (error) {
        console.error('Error fetching blog by id:', error);
        return null;
    }
};

export const toggleBlogLike = async (id: number): Promise<{ is_liked: boolean; likes_count: number } | null> => {
    try {
        return await apiClient<{ is_liked: boolean; likes_count: number }>(`/api/blogs/${id}/like`, {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        return null;
    }
};

export const searchProductsForMentions = async (query: string): Promise<{ id: string; display: string }[]> => {
    try {
        const res = await apiClient<{ id: string; display: string }[]>(`/api/blogs/search-products?q=${encodeURIComponent(query)}`, {
            method: 'GET'
        });
        return res || [];
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
};

export const storeBlog = async (data: {
    title: string;
    location?: string | null;
    caption_html: string;
    images: string[];
    tagged_products: number[]
}): Promise<boolean> => {
    try {
        await apiClient('/api/blogs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return true;
    } catch (error) {
        console.error('Error creating blog:', error);
        return false;
    }
};

export const updateBlog = async (id: string | number, data: {
    title: string;
    location?: string | null;
    caption_html: string;
    images: string[];
    tagged_products: number[]
}): Promise<boolean> => {
    try {
        await apiClient(`/api/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return true;
    } catch (error) {
        console.error('Error updating blog:', error);
        return false;
    }
};