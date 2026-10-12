import phil, { ProvinceItem, CityMunItem, BarangayItem } from 'phil-reg-prov-mun-brgy';

export type IslandGroup = 'LUZON' | 'VISAYAS' | 'MINDANAO';

export interface RegionOption {
    code: string;
    name: string;
    label: string;
    islandGroup: IslandGroup;
}

export interface PlaceOption {
    code: string;
    name: string;
    displayName: string;
}

export const PH_REGIONS: RegionOption[] = [
    // LUZON
    { code: '13', name: 'NATIONAL CAPITAL REGION (NCR)', label: 'Metro Manila (NCR)', islandGroup: 'LUZON' },
    { code: '14', name: 'CORDILLERA ADMINISTRATIVE REGION (CAR)', label: 'CAR (Cordillera)', islandGroup: 'LUZON' },
    { code: '01', name: 'REGION I (ILOCOS REGION)', label: 'Region I (Ilocos Region)', islandGroup: 'LUZON' },
    { code: '02', name: 'REGION II (CAGAYAN VALLEY)', label: 'Region II (Cagayan Valley)', islandGroup: 'LUZON' },
    { code: '03', name: 'REGION III (CENTRAL LUZON)', label: 'Region III (Central Luzon)', islandGroup: 'LUZON' },
    { code: '04', name: 'REGION IV-A (CALABARZON)', label: 'Region IV-A (CALABARZON)', islandGroup: 'LUZON' },
    { code: '17', name: 'REGION IV-B (MIMAROPA)', label: 'Region IV-B (MIMAROPA)', islandGroup: 'LUZON' },
    { code: '05', name: 'REGION V (BICOL REGION)', label: 'Region V (Bicol Region)', islandGroup: 'LUZON' },

    // VISAYAS
    { code: '06', name: 'REGION VI (WESTERN VISAYAS)', label: 'Region VI (Western Visayas)', islandGroup: 'VISAYAS' },
    { code: '07', name: 'REGION VII (CENTRAL VISAYAS)', label: 'Region VII (Central Visayas)', islandGroup: 'VISAYAS' },
    { code: '08', name: 'REGION VIII (EASTERN VISAYAS)', label: 'Region VIII (Eastern Visayas)', islandGroup: 'VISAYAS' },

    // MINDANAO
    { code: '09', name: 'REGION IX (ZAMBOANGA PENINSULA)', label: 'Region IX (Zamboanga Peninsula)', islandGroup: 'MINDANAO' },
    { code: '10', name: 'REGION X (NORTHERN MINDANAO)', label: 'Region X (Northern Mindanao)', islandGroup: 'MINDANAO' },
    { code: '11', name: 'REGION XI (DAVAO REGION)', label: 'Region XI (Davao Region)', islandGroup: 'MINDANAO' },
    { code: '12', name: 'REGION XII (SOCCSKSARGEN)', label: 'Region XII (SOCCSKSARGEN)', islandGroup: 'MINDANAO' },
    { code: '16', name: 'REGION XIII (Caraga)', label: 'Region XIII (Caraga)', islandGroup: 'MINDANAO' },
    { code: '15', name: 'AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)', label: 'BARMM / ARMM (Bangsamoro)', islandGroup: 'MINDANAO' },
];

const ACRONYMS = new Set([
    'NCR', 'CAR', 'ARMM', 'BARMM', 'QC', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'
]);

export function formatPlaceName(str: string): string {
    if (!str) return '';
    return str
        .split(' ')
        .map((word) => {
            const clean = word.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (ACRONYMS.has(clean)) {
                return word.toUpperCase();
            }
            if (word.length <= 1) return word.toUpperCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}

export function getRegions(): RegionOption[] {
    return PH_REGIONS;
}

export function getProvincesByRegion(regionCode: string): PlaceOption[] {
    if (!regionCode) return [];
    const rawProvinces = phil.getProvincesByRegion(regionCode) || [];
    const seen = new Set<string>();
    const list: PlaceOption[] = [];

    for (const item of rawProvinces) {
        if (seen.has(item.prov_code)) continue;
        seen.add(item.prov_code);

        let displayName = formatPlaceName(item.name);
        if (item.prov_code === '1339') displayName = 'Metro Manila - 1st District (City of Manila)';
        if (item.prov_code === '1374') displayName = 'Metro Manila - 2nd District (QC, Pasig, etc.)';
        if (item.prov_code === '1375') displayName = 'Metro Manila - 3rd District (Caloocan, Valenzuela, etc.)';
        if (item.prov_code === '1376') displayName = 'Metro Manila - 4th District (Makati, Taguig, Pasay, etc.)';

        list.push({
            code: item.prov_code,
            name: displayName,
            displayName,
        });
    }

    return list.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export function getCitiesByProvince(provinceCode: string): PlaceOption[] {
    if (!provinceCode) return [];
    const rawCities = phil.getCityMunByProvince(provinceCode) || [];
    const seen = new Set<string>();
    const list: PlaceOption[] = [];

    for (const item of rawCities) {
        if (seen.has(item.mun_code)) continue;
        seen.add(item.mun_code);

        const displayName = formatPlaceName(item.name);
        list.push({
            code: item.mun_code,
            name: displayName,
            displayName,
        });
    }

    return list.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export function getBarangaysByCity(cityCode: string): PlaceOption[] {
    if (!cityCode) return [];
    const rawBrgys = phil.getBarangayByMun(cityCode) || [];
    const list: PlaceOption[] = [];

    for (const item of rawBrgys) {
        const displayName = formatPlaceName(item.name);
        list.push({
            code: item.name, // in phil library barangay has no unique code, name is the identifier
            name: displayName,
            displayName,
        });
    }

    return list.sort((a, b) => a.displayName.localeCompare(b.displayName));
}
