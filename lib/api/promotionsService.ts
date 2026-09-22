// lib/api/promotions.ts
import { apiClient } from './apiClient';
import { Promotion, PromotionScope, DiscountType } from '@/types/promotionsType';

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

export type UpdatePromotionPayload = Partial<CreatePromotionPayload>;

export const promotionsApi = {
    getAll: () => apiClient<Promotion[]>('/admin/promotions'),

    getById: (id: string | number) => apiClient<Promotion>(`/admin/promotions/${id}`),

    create: (payload: CreatePromotionPayload) =>
        apiClient<Promotion>('/admin/promotions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }),

    update: (id: string | number, payload: UpdatePromotionPayload) =>
        apiClient<Promotion>(`/admin/promotions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }),

    delete: (id: string | number) =>
        apiClient<{ success: boolean; message?: string }>(`/admin/promotions/${id}`, {
            method: 'DELETE',
        }),
};