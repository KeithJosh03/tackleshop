import { facebook, googlemap,instagram } from '@/public/socials';
import { StaticImageData } from 'next/image';


interface Socials {
  url:string;
  logo: StaticImageData;
}

export const socials:Socials[] = [
  {
    url:'https://www.facebook.com/WankOfficial',
    logo:facebook
  },
  {
    url:'https://www.google.com/maps/dir/7.1167266,125.6168974/Chill+Out+Family+KTV+Bar+Lanang+by+Hutspot,+Falcata+St,+Buhangin,+Davao+City,+8000+Davao+del+Sur/@7.1061229,125.6193865,15z/data=!4m9!4m8!1m0!1m5!1m1!1s0x32f96d859c27cc2d:0xc11b80784b59e559!2m2!1d125.6478824!2d7.114239!3e2!5m1!1e2?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D',
    logo:googlemap
  },
  {
    url:'https://www.instagram.com/',
    logo:instagram
  },
] 

