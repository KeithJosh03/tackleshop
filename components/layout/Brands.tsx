import { BrandLogos } from "@/lib/api/brandService";
import BrandLogoClient from "./BrandsClient";

export default async function Brands() {
  const brandlogos = await BrandLogos();

  return (
    <BrandLogoClient 
    brandlogos={brandlogos}
    />
  )
}
