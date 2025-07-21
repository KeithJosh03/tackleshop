import { logo, arrowdown, hero, testproduct } from '@/public';
import { StaticImageData } from 'next/image';

interface AssetsInterface {
  [key: string]: StaticImageData;
}

export const imagesAsset: AssetsInterface = {
    logo,
    arrowdown,
    hero,
    testproduct
};

