import { Promotion } from '@/types/promotionsType';

export const calculateDiscountedPrice = (originalPrice: number, promotion: Promotion): number => {
    if (promotion.status !== 'ACTIVE') return originalPrice;

    const now = new Date().getTime();
    const start = new Date(promotion.startDate.replace(' ', 'T')).getTime();
    const end = new Date(promotion.endDate.replace(' ', 'T')).getTime();

    if (now < start || now > end) return originalPrice;

    if (promotion.discountType === 'PERCENTAGE') {
        const discountAmount = (originalPrice * promotion.discountValue) / 100;
        return Math.max(0, originalPrice - discountAmount);
    }

    if (promotion.discountType === 'FIXED_AMOUNT') {
        return Math.max(0, originalPrice - promotion.discountValue);
    }

    return originalPrice;
};