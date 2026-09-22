import { useState, useEffect, useCallback } from 'react';
import { promotionsApi, CreatePromotionPayload, UpdatePromotionPayload } from '@/lib/api/promotionsService';
import { Promotion } from '@/types/promotionsType';

export const usePromotions = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPromotions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await promotionsApi.getAll();
            setPromotions(data || []);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch promotions');
        } finally {
            setLoading(false);
        }
    }, []);

    const createPromotion = async (payload: CreatePromotionPayload) => {
        const newPromo = await promotionsApi.create(payload);
        if (newPromo) {
            setPromotions((prev) => [...prev, newPromo]);
        }
        return newPromo;
    };

    const updatePromotion = async (id: number | string, payload: UpdatePromotionPayload) => {
        const updated = await promotionsApi.update(id, payload);
        if (updated) {
            setPromotions((prev) => prev.map((p) => (p.id === id ? updated : p)));
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