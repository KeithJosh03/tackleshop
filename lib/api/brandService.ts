import axios from 'axios';

export interface BrandData {
  brandName: string;
  imageUrl: string;
}

export async function createBrand(data: BrandData) {
  const response = await axios.post('/api/brands', {
    brand_name: data.brandName,
    image_url: data.imageUrl,
  });
  return response.data;
}

// HEADER
export interface BrandHeaderProps {
  brandId: number;
  brandName: string;
  imageUrl?: string | null;
}

interface HeaderBrandResponse {
  status: boolean;
  brands: BrandHeaderProps[];
}

export async function showBrandListName(): Promise<BrandHeaderProps[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brands/brandNameList/`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch brands');
  }

  const data: HeaderBrandResponse = await res.json();
  return data.brands;
}


// BrandLogos
export interface BrandLogosProps {
  brandId: number;
  brandName: string;
  imageUrl?: string | null;
}

interface BrandLogosResponse {
  status:boolean;
  brandlogo:BrandLogosProps[];
}

export async function BrandLogos(): Promise<BrandLogosProps[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brands/brandlogo/`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch brands');
  }

  const data: BrandLogosResponse = await res.json();
  return data.brandlogo;
}


export interface UpdateBrandData {
  brandId: number;
  brandName?: string;
  imageUrl?: string;
}

export async function updateBrand(data: UpdateBrandData) {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brands/${data.brandId}`,
    {
      ...(data.brandName && { brand_name: data.brandName }),
      ...(data.imageUrl && { image_url: data.imageUrl }),
    }
  );
  return response.data;
}


export async function deleteBrand({
  brandId,
}: {
  brandId: number;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brands/${brandId}`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to delete brand');
  }

  return;
}



