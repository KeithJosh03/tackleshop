
import { inter } from "@/types/fonts";
import { BrandLogosProps } from "@/lib/api/brandService";
import BrandCard from "./BrandsCardLogo";


export default function BrandLogoClient(
  { brandlogos }:
    { brandlogos: BrandLogosProps[] }
) {
  const hasBrands = Array.isArray(brandlogos) && brandlogos.length > 0;
  return (
    <section className=" w-full flex flex-col items-center justify-center py-10 gap-y-6 overflow-hidden" id="brands">

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

      {/* Brands Grid */}
      {hasBrands && (
        <div className="w-full max-w-7xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {brandlogos.map((brand, index) => (
              <div
                key={`brand-${brand.brandId}`}
                className="w-full animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <BrandCard {...brand} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
