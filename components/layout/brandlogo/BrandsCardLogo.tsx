import { BrandLogosProps } from "@/lib/api/brandService";
import Link from "next/link";
import slugify from "slugify";
import Image from "next/image";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function BrandCard({ brandId, brandName, imageUrl }: BrandLogosProps) {
    return (
        <Link
            href={`/brand/${slugify(brandName.toLowerCase())}`}
            key={brandId}
            className="group brand-card"
            aria-label={brandName}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-primaryColor/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"></div>
            <div className="relative w-full h-full z-10 flex items-center justify-center p-1 sm:p-2">
                <Image
                    src={`${baseURL}${imageUrl}`}
                    alt={brandName}
                    fill
                    className="object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-md group-hover:drop-shadow-lg"
                />
            </div>
            <div className="brand-logo-text bg-primaryColor/95 backdrop-blur-md shadow-lg border-t border-primaryColor/50 z-20">
                {brandName}
            </div>
        </Link>
    );
}