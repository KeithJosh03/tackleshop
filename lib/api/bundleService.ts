const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export interface BundleItemPayload {
    product_id: number;
    sku_id?: number | null;
    quantity: number;
    is_required: boolean;
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
    description?: string;
    hero_banner?: string | null;
    sku: string;
    pricing_type: 'fixed' | 'calculated';
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
