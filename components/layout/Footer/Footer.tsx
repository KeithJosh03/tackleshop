'use client';
import { montserrat } from "@/types/fonts";
import Image from "next/image";
import { socials } from "@/types/socials";
import Link from "next/link";
import { imagesAsset } from "@/types/image";

export default function Footer() {
  return (
    <footer className={`${montserrat.className} relative z-10 text-white w-full flex flex-col items-center border-t border-ma-primary/20 bg-ma-surface-container-low shadow-[0_-5px_15px_rgba(0,0,0,0.3)]`}>
      <div className="w-full max-w-7xl mx-auto px-6 py-10 md:py-8 gap-y-10 md:gap-y-0 flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">

        {/* Brand / Logo Section */}
        <div className="flex flex-col items-center md:items-start max-w-xs w-full">
          <Link href='/' className="relative w-52 h-20 mb-4 group cursor-pointer block">
            <Image
              src={imagesAsset.logo}
              fill={true}
              sizes="(min-width: 1024px) 256px, (min-width: 768px) 192px, 128px"
              alt='Smooth Casting Tackle Shop Logo'
              className='object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg'
            />
          </Link>
          <p className="text-ma-on-surface/70 text-sm leading-relaxed mt-2 font-medium">
            Your premier destination for high-quality, dependable fishing gear. We equip anglers for their next great catch.
          </p>
        </div>

        {/* Contact Info Section */}
        <div className='flex flex-col gap-y-3.5 text-[15px] font-medium'>
          <h4 className={`${montserrat.className} text-ma-primary font-bold tracking-wider uppercase mb-1 text-lg`}>Contact Us</h4>

          <div className="flex items-start gap-3 group">
            <span className={`${montserrat.className} font-bold text-ma-primary/90 min-w-[100px]`}>Location:</span>
            <span className="text-ma-on-surface/80 group-hover:text-ma-on-surface transition-colors max-w-xs">Falcata St, Buhangin, Davao City, 8000 Davao del Sur</span>
          </div>

          <div className="flex items-start gap-3 group">
            <span className={`${montserrat.className} font-bold text-ma-primary/90 min-w-[100px]`}>Email:</span>
            <a href="mailto:smoothcastingtackleshop@gmail.com" className="text-ma-on-surface/80 hover:text-ma-primary transition-colors relative">
              smoothcastingtackleshop@gmail.com
              <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-ma-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-start gap-3 group">
            <span className={`${montserrat.className} font-bold text-ma-primary/90 min-w-[100px]`}>Phone:</span>
            <a href="tel:09770598624" className="text-ma-on-surface/80 hover:text-ma-primary transition-colors relative">
              0977 059 8624
              <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-ma-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-start gap-3 group mt-1">
            <span className={`${montserrat.className} font-bold text-ma-primary/90 min-w-[100px]`}>Store Hours:</span>
            <span className="text-ma-on-surface/80">Monday - Saturday <br className="hidden md:block" />(9:30 AM–5:30 PM)</span>
          </div>
        </div>

        {/* Socials / Links Section */}
        <div className="flex flex-col items-center justify-center md:items-end w-full md:w-auto h-full space-y-4 pt-4 md:pt-0">
          <h4 className={`${montserrat.className} text-ma-primary font-bold tracking-wider uppercase mb-2 text-lg`}>Follow Us</h4>
          <div className="flex flex-row items-center gap-x-5">
            {socials.map((social, key) => (
              <button
                key={key}
                aria-label={`Visit our social media`}
                onClick={() => { window.open(social.url, '_blank') }}
                className="relative w-11 h-11 p-2 rounded-full border border-white/[0.08] hover:bg-ma-primary/10 hover:border-ma-primary/60 hover:scale-110 hover:shadow-[0_0_15px_rgba(232,147,71,0.25)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group cursor-pointer"
              >
                <div className="relative w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <Image
                    src={social.logo}
                    fill={true}
                    alt='Social Logo'
                    className='object-contain'
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full flex items-center justify-center py-5 border-t border-white/5 bg-ma-surface-container-lowest">
        <p className="font-semibold text-[13px] text-ma-on-surface/50 tracking-wide">
          © {new Date().getFullYear()} Smooth Casting Tackle Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
