// lib/utils/skuGenerator.ts

import { FormVariantType, FormVariantOption } from '@/lib/reducer/productFormReducer';

export interface MatrixRowData {
    skuCode: string;
    stockQuantity: string;
    price: string;
    variantOptionIds: (string | number)[];
    imageUrl: File | string | null;
}

export const deriveAttributeCode = (optionValue: string): string => {
    if (!optionValue) return '';

    const trimmed = optionValue.trim();
    const lower = trimmed.toLowerCase();

    // Exact mapping for common sizes, colors, and fishing specs
    const exactMap: Record<string, string> = {
        'small': 'S',
        'medium': 'M',
        'large': 'L',
        'extra small': 'XS',
        'extra large': 'XL',
        'xx-large': 'XXL',
        'xxlarge': 'XXL',
        'xxx-large': 'XXXL',
        'xxxlarge': 'XXXL',
        'ultralight': 'UL',
        'ultra light': 'UL',
        'heavy': 'HVY',
        'light': 'LT',
        'fast': 'FST',
        'slow': 'SLW',
        'black': 'BLK',
        'white': 'WHT',
        'green': 'GRN',
        'yellow': 'YLW',
        'silver': 'SLV',
        'gold': 'GLD',
        'orange': 'ORG',
        'purple': 'PRP',
        'pink': 'PNK',
        'brown': 'BRN',
        'grey': 'GRY',
        'gray': 'GRY',
        'blue': 'BLU',
        'red': 'RED',
        'modded': 'MOD',
    };

    if (exactMap[lower]) {
        return exactMap[lower];
    }

    // Clean non-alphanumeric except spaces
    const clean = trimmed.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (!clean) {
        return trimmed.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 3);
    }

    const words = clean.split(/\s+/).filter(Boolean);

    // If string has digits/numbers (e.g., "50lb", "4000HG", "10ft"), preserve it cleanly
    if (/\d/.test(clean) && words.length <= 2) {
        return clean.replace(/\s+/g, '').toUpperCase().substring(0, 6);
    }

    if (words.length > 1) {
        // Multi-word without numbers: take first letter of each word (up to 3)
        return words.map(w => w[0]).join('').toUpperCase().substring(0, 3);
    }

    const word = words[0];

    // Single word / code (e.g. "S", "M", "L", "RED")
    if (word.length <= 3) {
        return word.toUpperCase();
    }

    // Single word > 3 chars (e.g. "Black" -> "BLK", "Silver" -> "SLV")
    const firstChar = word[0].toUpperCase();
    const rest = word.slice(1);
    const consonants = rest.replace(/[aeiouAEIOU]/g, '');

    if (consonants.length >= 2) {
        return (firstChar + consonants.substring(0, 2)).toUpperCase();
    }

    return word.substring(0, 3).toUpperCase();
};

export const deriveBrandCode = (brandName: string): string => {
    if (!brandName) return '';
    const trimmed = brandName.trim();
    const lower = trimmed.toLowerCase();

    const brandMap: Record<string, string> = {
        'shimano': 'SHM',
        'daiwa': 'DW',
        'tukob': 'TUK',
        'abu garcia': 'ABU',
        'penn': 'PENN',
        'okuma': 'OKM',
        'rapala': 'RPL',
        'berkley': 'BRK',
        'megabass': 'MGB',
        'major craft': 'MJC',
    };

    if (brandMap[lower]) return brandMap[lower];
    return deriveAttributeCode(trimmed);
};

export const generateTitleCode = (productTitle: string, brandName?: string): string => {
    const cleanTitle = (productTitle || '').replace(/[^a-zA-Z0-9\s]/g, '').trim();
    let words = cleanTitle.split(/\s+/).filter(Boolean);

    if (words.length === 0) return 'PROD';

    // Strip brand name if title starts with it (e.g. "Abu Garcia Max Pro" -> "Max Pro")
    if (brandName) {
        const cleanBrand = brandName.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
        const cleanTitleLower = cleanTitle.toLowerCase();

        if (cleanTitleLower.startsWith(cleanBrand)) {
            const remaining = cleanTitle.substring(cleanBrand.length).trim();
            const remainingWords = remaining.split(/\s+/).filter(Boolean);
            if (remainingWords.length > 0) {
                words = remainingWords;
            }
        }
    }

    // Return first meaningful word snippet (up to 4 chars)
    return words[0].substring(0, 4).toUpperCase();
};

export const generateSimpleSku = (
    productTitle: string,
    brandName?: string,
    categoryName?: string,
    subCategoryName?: string
): string => {
    const brandCode = brandName ? deriveBrandCode(brandName) : '';
    const categoryCode = categoryName ? deriveAttributeCode(categoryName) : '';
    const subCategoryCode = subCategoryName ? deriveAttributeCode(subCategoryName) : '';
    const titleCode = generateTitleCode(productTitle, brandName);

    // Format: BRAND-CAT-SUBCAT-TITLE (e.g., DW-REE-SR-SPOR)
    const parts = [brandCode, categoryCode, subCategoryCode, titleCode].filter(Boolean);
    return parts.join('-');
};

export const generateVariantSku = (
    parentSkuOrTitle: string,
    optionValues: string[] = [],
    brandName?: string
): string => {
    const isFullSku = parentSkuOrTitle.includes('-');
    const baseCode = isFullSku
        ? parentSkuOrTitle
        : generateTitleCode(parentSkuOrTitle, brandName);

    const attrCodes = optionValues
        .map(val => deriveAttributeCode(val).replace(/[^a-zA-Z0-9]/g, '').toUpperCase())
        .filter(Boolean);

    if (attrCodes.length === 0) return baseCode;
    return [baseCode, ...attrCodes].join('-');
};

export const generateSku = (
    productTitle: string,
    optionValues: string[] = [],
    brandName?: string,
    categoryName?: string,
    subCategoryName?: string
): string => {
    if (optionValues.length > 0) {
        const parentSku = generateSimpleSku(productTitle, brandName, categoryName, subCategoryName);
        return generateVariantSku(parentSku, optionValues);
    }
    return generateSimpleSku(productTitle, brandName, categoryName, subCategoryName);
};

/**
 * Generates Cartesian matrix rows for all variant combinations 
 * using current master SKU, title, and base price.
 */
export const generateVariantCombinations = (
    variants: FormVariantType[],
    masterSku: string,
    basePrice: string = '0',
    productTitle: string = ''
): Record<string, MatrixRowData> => {
    const validTypes = variants.filter((v) => v.variantOptions.length > 0);
    if (validTypes.length === 0) return {};

    const cartesian = (acc: FormVariantOption[][], curr: FormVariantType) =>
        acc.flatMap((accItem) => curr.variantOptions.map((opt) => [...accItem, opt]));

    const initialAcc: FormVariantOption[][] = validTypes[0].variantOptions.map((opt) => [opt]);
    const rawCombinations = validTypes.slice(1).reduce(cartesian, initialAcc);

    const newRows: Record<string, MatrixRowData> = {};
    const baseSku = masterSku.trim() || generateTitleCode(productTitle);

    rawCombinations.forEach((combo) => {
        const comboLabel = combo.map((o) => o.variantOptionValue).join(' / ');
        const optionValues = combo.map((o) => o.variantOptionValue);

        const autoSku = generateVariantSku(baseSku, optionValues);

        newRows[comboLabel] = {
            skuCode: autoSku,
            stockQuantity: '0',
            price: basePrice || '0',
            variantOptionIds: combo.map((o) => o.id),
            imageUrl: null,
        };
    });

    return newRows;
};