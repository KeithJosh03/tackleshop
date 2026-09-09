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

    if (words.length > 1) {
        // Multi-word: take first letter of each word (up to 3)
        return words.map(w => w[0]).join('').toUpperCase().substring(0, 3);
    }

    const word = words[0];

    // Single word / code (e.g. "S", "M", "L", "70", "100", "RED")
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

export const generateSimpleSku = (productTitle: string, brandName?: string): string => {
    const brandCode = brandName ? deriveBrandCode(brandName) : '';

    const cleanTitle = (productTitle || '').replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const words = cleanTitle.split(/\s+/).filter(Boolean);

    let titleCode = '';
    if (words.length === 0) {
        titleCode = 'PROD';
    } else if (words.length === 1) {
        titleCode = words[0].substring(0, 4).toUpperCase();
    } else {
        let idx = 0;
        if (brandName && words[0].toLowerCase() === brandName.toLowerCase() && words.length > 1) {
            idx = 1;
        }
        titleCode = words[idx].substring(0, 4).toUpperCase();
    }

    const parts = [brandCode, titleCode, '001'].filter(Boolean);
    return parts.join('-');
};

export const deriveBasePrefixFromTitle = (productTitle: string): string => {
    const cleanTitle = (productTitle || '').replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const words = cleanTitle.split(/\s+/).filter(Boolean);

    if (words.length === 0) return 'PROD';
    return words[0].toUpperCase();
};

export const generateVariantSkuFromTitle = (
    productTitle: string,
    optionValues: string[] = []
): string => {
    const parentCode = deriveBasePrefixFromTitle(productTitle);
    const attrCodes = optionValues
        .map(val => deriveAttributeCode(val).replace(/[^a-zA-Z0-9]/g, '').toUpperCase())
        .filter(Boolean);

    if (attrCodes.length === 0) return parentCode;
    return [parentCode, ...attrCodes].join('-');
};

export const generateVariantSku = (parentSkuOrTitle: string, optionValues: string[] = []): string => {
    return generateVariantSkuFromTitle(parentSkuOrTitle, optionValues);
};

export const generateSku = (productTitle: string, optionValues: string[] = []): string => {
    if (optionValues.length > 0) {
        return generateVariantSku(productTitle, optionValues);
    }
    return generateSimpleSku(productTitle);
};
