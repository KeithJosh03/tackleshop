
import { montserrat } from "@/types/fonts";
import { BrandProps } from "@/types/brandType"
import BrandCard from "./BrandsCard";

export default function BrandsCardClient(
  { brandlogos }:
    { brandlogos: BrandProps[] }
) {
  const hasBrands = Array.isArray(brandlogos) && brandlogos.length > 0;
  return (
    <section
      className="relative w-full overflow-hidden px-4 pb-20 pt-14 sm:px-6 bg-ma-surface-container-low"
      id="brands"
    >

      {/* ── Decorative divider ── */}
      <div className="mx-auto mb-14 flex w-full max-w-4xl items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="h-1 w-1 rotate-45 rounded-[1px] bg-ma-primary/50" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-y-10">

        {/* ── Section Header ── */}
        <div className="flex flex-col items-center gap-y-3 px-4 text-center">
          <h2
            className={`${montserrat.className} text-3xl font-extrabold uppercase tracking-wider text-ma-primary sm:text-4xl md:text-5xl`}
          >
            Our Brands
          </h2>
          <p className={`${montserrat.className} max-w-md text-[0.82rem] leading-relaxed text-ma-on-surface/40 sm:text-sm`}>
            Gear up with the world&apos;s leading fishing brands —
            <br className="hidden sm:block" />
            exclusively at Smooth Casting.
          </p>
        </div>

        {/* ── Brand Cards Grid ── */}
        {hasBrands && (
          <div className="w-full px-1 sm:px-4">
            <div className="grid grid-cols-2 justify-items-center gap-3.5 xs:grid-cols-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {brandlogos.map((brand, index) => (
                <div
                  key={`brand-${brand.brandId}`}
                  className="w-full animate-fade-in-up"
                  style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
                >
                  <BrandCard {...brand} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
