const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export interface RegisterPayload {
    name: string;
    email: string;
    password?: string;
    provider_name?: 'google' | 'facebook';
    provider_id?: string;
    avatar_url?: string;
}

export const registerUser = async (data: RegisterPayload) => {
    try {
        const response = await fetch(`${baseURL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || errorData?.error || 'Registration failed');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Registration Error:', error);
        throw error;
    }
};
