import { logo } from '@/public';

import { StaticImageData } from 'next/image';


interface Logo {
    image: StaticImageData;
}


export const imagelogo: Logo = {
    image:logo
}