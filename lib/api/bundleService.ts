const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export interface BundleItemPayload {
    product_id: number;
    sku_id?: number | null;
    quantity: number;
    is_required: boolean;
    group_name?: string | null;
}

export interface CustomInclusionPayload {
    title: string;
    price: number;
    quantity: number;
    is_required: boolean;
}

export interface CreateBundlePayload {
    bundle_title: string;
    slug?: string;
    setup_category_id?: number;
    description?: string;
    hero_banner?: string | null;
    sku: string;
    pricing_type: string;
    retail_price?: number;
    discount_percentage?: number;
    bundle_price: number;
    stock_quantity: number;
    is_published: boolean;
    start_date?: string;
    end_date?: string;
    bundle_items: BundleItemPayload[];
    custom_inclusions?: CustomInclusionPayload[];
}

export const createBundle = async (payload: CreateBundlePayload): Promise<any> => {
    console.log('Submitting Bundle Payload:', payload);
    const response = await fetch(`${BASE_URL}/api/setups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || 'Failed to create bundle setup.');
        } catch {
            throw new Error('A server error occurred while creating the bundle setup.');
        }
    }

    return await response.json();
};

export const getSetups = async (token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/setups`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch setups');
    }
    return await response.json();
};

export const toggleSetupStatus = async (id: number, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/admin/setups/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to toggle status');
    }
    return await response.json();
};

export const deleteSetup = async (id: number, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/admin/setups/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete setup');
    }
    return await response.json();
};

export const getSetupById = async (id: number, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/admin/setups/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch setup details');
    }
    return await response.json();
};

export const updateBundle = async (id: number, payload: CreateBundlePayload, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/admin/setups/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || 'Failed to update bundle setup.');
        } catch {
            throw new Error('A server error occurred while updating the bundle setup.');
        }
    }

    return await response.json();
};
