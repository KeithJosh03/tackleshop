// lib/api/promotions.ts
import { apiClient } from './apiClient';
import { Promotion, PromotionScope, DiscountType } from '@/types/promotionsType';

export interface CreatePromotionPayload {
    name: string;
    discount_type: DiscountType;
    discount_value: number;
    apply_to: PromotionScope;
    target_ids: number[];
    start_date: string | null;
    end_date: string | null;
    is_active?: boolean;
}

export type UpdatePromotionPayload = Partial<CreatePromotionPayload>;

export const promotionsApi = {
    getAll: () => apiClient<Promotion[]>('/api/admin/promotions'),

    getById: (id: string | number) => apiClient<Promotion>(`/api/admin/promotions/${id}`),

    create: (payload: CreatePromotionPayload) =>
        apiClient<Promotion>('/api/admin/promotions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }),

    update: (id: string | number, payload: UpdatePromotionPayload) =>
        apiClient<Promotion>(`/api/admin/promotions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }),

    delete: (id: string | number) =>
        apiClient<{ success: boolean; message?: string }>(`/api/admin/promotions/${id}`, {
            method: 'DELETE',
        }),
};