import { getSession } from 'next-auth/react';

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`;
    const session = await getSession();
    const token = (session as { accessToken?: string } | null)?.accessToken;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const textBuffer = await response.text();
        try {
            const jsonError = JSON.parse(textBuffer);
            throw new Error(jsonError.message || `Request failed with status ${response.status}`);
        } catch (error) {
            throw new Error('A critical server error occurred.');
        }
    }

    return response.json();
};

export interface UserListProp {
    id: number;
    name: string;
    email: string;
    role_id: number;
    created_at: string;
    role?: {
        id: number;
        role_name: string;
    };
}

export const FetchUsers = async (): Promise<UserListProp[]> => {
    const data = await apiClient<{ data: UserListProp[] }>('/api/admin/users');
    return data.data;
};

export const UpdateUserRole = async (userId: number, roleId: number): Promise<void> => {
    await apiClient(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role_id: roleId }),
    });
};
