import { BrandLogos } from "@/lib/api/brandService";
import BrandsCardClient from "./BrandsCardClient";

export default async function BrandsLogo() {
  const brandlogos = await BrandLogos();

  if (!brandlogos || brandlogos.length === 0) {
    return null;
  }

  return <BrandsCardClient brandlogos={brandlogos} />;
}