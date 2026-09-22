// types/promotions.ts

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type PromotionScope = 'ALL' | 'CATEGORY' | 'PRODUCT';
export type PromotionStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';

/**
 * Shape of target objects returned from Laravel API relationships
 */
export interface PromotionTarget {
    id: number;
    promotion_id: number;
    target_id: number;
    target_type?: string; // e.g. App\Models\Category or App\Models\Product
    created_at?: string;
    updated_at?: string;
}

/**
 * Raw response payload structure from Laravel backend
 */
export interface PromotionApiResponse {
    id?: number;
    promotion_id?: number;
    name: string;
    discount_type: DiscountType;
    discount_value: string | number;
    apply_to: PromotionScope;
    start_date: string;
    end_date: string;
    is_active: boolean | number;
    targets?: PromotionTarget[];
    created_at?: string;
    updated_at?: string;
}

/**
 * Frontend UI model used in components and state management
 */
export interface Promotion {
    id: number | string;
    name: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    status: PromotionStatus;
    applyTo: PromotionScope;
    targetItems: (number | string)[];
}

/**
 * Payload sent to POST / PUT endpoints in Laravel
 */
export interface CreatePromotionPayload {
    name: string;
    discount_type: DiscountType;
    discount_value: number;
    apply_to: PromotionScope;
    target_ids: number[];
    start_date: string;
    end_date: string;
    is_active?: boolean;
}