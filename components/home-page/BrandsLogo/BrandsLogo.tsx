import { BrandLogos } from "@/lib/api/brandService";
import BrandsCardClient from "./BrandsCardClient";

export default async function BrandsLogo() {
  const brandlogos = await BrandLogos();
  return (
    <BrandsCardClient
      brandlogos={brandlogos}
    />
  )
}
