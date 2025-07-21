import { Abugarcia, Shimano, svgg } from '@/public/brands';
import { StaticImageData } from 'next/image';

interface BrandsInterface {
  [key: string]: StaticImageData;
}

export const brands: BrandsInterface = {
    Abugarcia,
    Shimano,
    svgg
};