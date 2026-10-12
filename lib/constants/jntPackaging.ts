export type PackagingType = 
    | 'POUCH_S' 
    | 'POUCH_L' 
    | 'BOX_S' 
    | 'BOX_M' 
    | 'BOX_L' 
    | 'LONG_PARCEL';

export interface PackagingPreset {
    key: PackagingType;
    label: string;
    description: string;
    length: number; // cm
    width: number;  // cm
    height: number; // cm
    isBulky: boolean;
}

export const JNT_PACKAGING_PRESETS: Record<PackagingType, PackagingPreset> = {
    POUCH_S: {
        key: 'POUCH_S',
        label: '✉️ Pouch S (Small Accessories / Lures)',
        description: 'Lures, hooks, small line spools (20 × 15 × 5 cm)',
        length: 20,
        width: 15,
        height: 5,
        isBulky: false,
    },
    POUCH_L: {
        key: 'POUCH_L',
        label: '✉️ Pouch L (Reels & Accessories)',
        description: 'Reels, small tackle accessories (30 × 20 × 10 cm)',
        length: 30,
        width: 20,
        height: 10,
        isBulky: false,
    },
    BOX_S: {
        key: 'BOX_S',
        label: '📦 Box S (Standard Tackle Box)',
        description: 'Boxed reels (e.g., Daiwa Exist) (30 × 24 × 15 cm)',
        length: 30,
        width: 24,
        height: 15,
        isBulky: false,
    },
    BOX_M: {
        key: 'BOX_M',
        label: '📦 Box M (Medium Tackle Case)',
        description: 'Multiple reels, medium utility cases (36 × 27 × 18 cm)',
        length: 36,
        width: 27,
        height: 18,
        isBulky: false,
    },
    BOX_L: {
        key: 'BOX_L',
        label: '📦 Box L (Large Storage / Mebao Box)',
        description: 'Heavy utility storage cases (e.g., Mebao Box) (46 × 30 × 23 cm)',
        length: 46,
        width: 30,
        height: 23,
        isBulky: true,
    },
    LONG_PARCEL: {
        key: 'LONG_PARCEL',
        label: '🎣 Long Parcel / Tube (Fishing Rods)',
        description: 'Fishing Rods / PVC Tubes (180 × 10 × 10 cm)',
        length: 180,
        width: 10,
        height: 10,
        isBulky: true,
    },
};

export const JNT_VOLUMETRIC_DIVISOR = 3500;

export function calcVolumetricWeightKg(packagingType: PackagingType | string): number {
    const preset = JNT_PACKAGING_PRESETS[packagingType as PackagingType] || JNT_PACKAGING_PRESETS.POUCH_S;
    const vol = (preset.length * preset.width * preset.height) / JNT_VOLUMETRIC_DIVISOR;
    return Math.round(vol * 100) / 100;
}

export function calcChargeableWeightKg(weightG: number, packagingType: PackagingType | string): number {
    const physicalKg = (Number(weightG) || 0) / 1000;
    const volKg = calcVolumetricWeightKg(packagingType);
    return Math.round(Math.max(physicalKg, volKg) * 100) / 100;
}

export function isBulkyPackaging(packagingType: PackagingType | string): boolean {
    return packagingType === 'BOX_L' || packagingType === 'LONG_PARCEL';
}
