import { graphiteleader, shimano } from '@/public/product';
import { StaticImageData } from 'next/image';

interface ProductInterface {
  [key: string]: StaticImageData;
}

export const products: ProductInterface = {
    shimano,
    graphiteleader
};