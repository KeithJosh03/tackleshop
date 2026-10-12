declare module 'phil-reg-prov-mun-brgy' {
    export interface RegionItem {
        name: string;
        reg_code: string;
    }

    export interface ProvinceItem {
        name: string;
        reg_code: string;
        prov_code: string;
    }

    export interface CityMunItem {
        name: string;
        prov_code: string;
        mun_code: string;
    }

    export interface BarangayItem {
        name: string;
        mun_code: string;
    }

    export const regions: RegionItem[];
    export const provinces: ProvinceItem[];
    export const city_mun: CityMunItem[];
    export const barangays: BarangayItem[];

    export function getProvincesByRegion(region_code: string): ProvinceItem[];
    export function getCityMunByProvince(province_code: string): CityMunItem[];
    export function getBarangayByMun(mun_code: string): BarangayItem[];
    export function sort<T>(arr: T[], sort?: 'A' | 'Z'): T[];

    const phil: {
        regions: RegionItem[];
        provinces: ProvinceItem[];
        city_mun: CityMunItem[];
        barangays: BarangayItem[];
        getProvincesByRegion(region_code: string): ProvinceItem[];
        getCityMunByProvince(province_code: string): CityMunItem[];
        getBarangayByMun(mun_code: string): BarangayItem[];
        sort<T>(arr: T[], sort?: 'A' | 'Z'): T[];
    };

    export default phil;
}
