import { useState, useEffect, useCallback } from 'react';
import { promotionsApi, CreatePromotionPayload, UpdatePromotionPayload } from '@/lib/api/promotionsService';
import { Promotion } from '@/types/promotionsType';

export const usePromotions = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mapPromotion = (p: any): Promotion => ({
        id: p.promotion_id,
        name: p.name || '',
        discountType: p.discount_type,
        discountValue: p.discount_value,
        applyTo: p.apply_to,
        startDate: p.start_date,
        endDate: p.end_date,
        isActive: p.is_active,
        status: p.status || (p.is_active ? 'ACTIVE' : 'EXPIRED'),
        targetItems: p.apply_to === 'SETUP' && p.setups
            ? p.setups.map((s: any) => s.setup_id || s.id)
            : p.apply_to === 'PRODUCT' && p.products
                ? p.products.map((prod: any) => prod.product_id || prod.id)
                : [],
        setups: p.setups || [],
        products: p.products || []
    } as Promotion);

    const fetchPromotions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await promotionsApi.getAll();
            if (data && Array.isArray(data)) {
                setPromotions(data.map(mapPromotion));
            } else {
                setPromotions([]);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch promotions');
        } finally {
            setLoading(false);
        }
    }, []);

    const createPromotion = async (payload: CreatePromotionPayload) => {
        const newPromo = await promotionsApi.create(payload);
        if (newPromo) {
            const mapped = mapPromotion(newPromo);
            setPromotions((prev) => [...prev, mapped]);
            return mapped;
        }
        return newPromo;
    };

    const updatePromotion = async (id: number | string, payload: UpdatePromotionPayload) => {
        const updated = await promotionsApi.update(id, payload);
        if (updated) {
            const mapped = mapPromotion(updated);
            setPromotions((prev) => prev.map((p) => (p.id === id ? mapped : p)));
            return mapped;
        }
        return updated;
    };

    const deletePromotion = async (id: number | string) => {
        await promotionsApi.delete(id);
        setPromotions((prev) => prev.filter((p) => p.id !== id));
    };

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    return { promotions, loading, error, fetchPromotions, createPromotion, updatePromotion, deletePromotion };
};