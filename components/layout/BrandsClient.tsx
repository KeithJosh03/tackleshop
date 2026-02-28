'use client';

import Link from "next/link";
import { inter } from "@/types/fonts";
import { BrandLogosProps } from "@/lib/api/brandService";
import Image from "next/image";
import slugify from "slugify";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

function BrandCard({ brandId, brandName, imageUrl }: BrandLogosProps) {
  return (
    <Link
      href={`/brand/${slugify(brandName.toLowerCase())}`}
      key={brandId}
      className="group brand-card bg-blackgroundColor/60 backdrop-blur-md border border-greyColor hover:border-primaryColor transition-all duration-500 rounded-xl flex items-center justify-center p-4 relative"
      aria-label={brandName}
    >
      <div className="relative w-full h-full">
        <Image
          src={`${baseURL}${imageUrl}`}
          alt={brandName}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="brand-logo-text bg-primaryColor/90 backdrop-blur-sm">
        {brandName}
      </div>
    </Link>
  );
}

export default function BrandLogoClient(
  { brandlogos }:
    { brandlogos: BrandLogosProps[] }
) {
  const hasBrands = Array.isArray(brandlogos) && brandlogos.length > 0;

  return (
    <section className="brands-section w-full flex flex-col items-center justify-center py-10 gap-y-6 overflow-hidden">

      {/* Header */}
      <div className="flex flex-col items-center gap-y-2 px-4 text-center">
        <h2
          className="text-3xl sm:text-4xl font-extrabold tracking-widest uppercase"
          style={{
            background: 'linear-gradient(90deg, #E89347 0%, #fafaf9 60%, #835d32 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Our Brands
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-primaryColor to-transparent" />
        <p className={`${inter.className} text-sm sm:text-base text-tertiaryColor/70 max-w-md`}>
          Gear up with the world&apos;s leading fishing brands — exclusively at Smooth Casting.
        </p>
      </div>

      {/* Marquee */}
      {hasBrands && (
        <div className="relative w-full overflow-hidden marquee-wrapper">
          {/* Edge fade vignette */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #131D29, transparent)' }}
          />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #131D29, transparent)' }}
          />

          <div className="brands-fade-mask">
            <div className="animate-marquee gap-x-4 sm:gap-x-6 py-4 px-4">
              {/* First set */}
              {brandlogos.map((brand) => (
                <BrandCard key={`a-${brand.brandId}`} {...brand} />
              ))}
              {/* Duplicate for seamless loop */}
              {brandlogos.map((brand) => (
                <BrandCard key={`b-${brand.brandId}`} {...brand} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
