// lib/api/apiClient.ts

// Server runtime uses API_BASE_URL; falls back to public key if omitted
const BASE_URL =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'http://localhost:8000';

type FetchOptions = RequestInit & {
    params?: Record<string, string | number>;
};

export async function apiClient<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T | null> {
    const { params, headers, ...restOptions } = options;

    const queryString = params
        ? '?' + new URLSearchParams(params as Record<string, string>).toString()
        : '';

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}${queryString}`;

    try {
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...headers,
            },
            ...restOptions,
        });

        if (!res.ok) {
            console.error(`[API Error] ${res.status} ${res.statusText} on ${endpoint}`);
            return null;
        }

        return (await res.json()) as T;
    } catch (error) {
        console.error(`[Network Error] Failed to fetch ${endpoint}:`, error);
        return null;
    }
}