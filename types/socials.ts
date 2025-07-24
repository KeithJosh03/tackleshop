import { facebook, googlemap,instagram } from '@/public/socials';
import { StaticImageData } from 'next/image';

interface BrandsInterface {
  [key: string]: StaticImageData;
}

export const socials: BrandsInterface = {
    facebook,
    googlemap,
    instagram
};