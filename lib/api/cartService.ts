import { apiClient } from './apiClient';
import { SetupCartChoice } from '@/lib/utils/setupBundleGroups';

// Types for Cart
export interface CartItem {
    cart_item_id: number;
    cart_id: number;
    setup_id?: number | null;
    product_id: number | null;
    sku_id: number | null;
    quantity: number;
    product?: any;
    sku?: any | null;
    setup?: {
        setup_id: number;
        bundle_title: string;
        slug?: string;
        bundle_price: string | number;
        sku?: string;
        images?: { image_url?: string; isMain?: boolean; is_main?: boolean }[];
    } | null;
    selections?: SetupCartChoice[] | null;
}

export interface Cart {
    cart_id: number;
    user_id: number | null;
    session_id: string | null;
    items: CartItem[];
}

export type AddToCartPayload =
    | {
          product_id: number;
          sku_id?: number | null;
          quantity: number;
          setup_id?: never;
      }
    | {
          setup_id: number;
          quantity: number;
          choices?: SetupCartChoice[];
          product_id?: never;
          sku_id?: never;
      };

// Get or generate a guest session ID for the cart
const getCartSessionId = () => {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
        sessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : 'cart_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
};

// Wrapper for apiClient to always inject the X-Session-ID header
const fetchWithCartSession = async <T>(endpoint: string, options: RequestInit = {}): Promise<T | null> => {
    const headers = {
        ...options.headers,
        'X-Session-ID': getCartSessionId()
    };
    return apiClient<T>(endpoint, { ...options, headers });
};

export const cartApi = {
    getCart: async () => {
        const response = await fetchWithCartSession<{ status: boolean; cart: Cart | null }>('/api/cart');
        return response?.cart || null;
    },

    addToCart: async (payload: AddToCartPayload) => {
        return fetchWithCartSession<{ status: boolean; message: string }>('/api/cart/add', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    updateQuantity: async (itemId: number, quantity: number) => {
        return fetchWithCartSession<{ status: boolean; message: string }>(`/api/cart/update/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    },

    removeItem: async (itemId: number) => {
        return fetchWithCartSession<{ status: boolean; message: string }>(`/api/cart/remove/${itemId}`, {
            method: 'DELETE'
        });
    }
};
