import axios from 'axios';

import { BrandProps } from '@/types/brandType';

export interface BrandData {
  brandName: string;
  imageUrl: string;
}

export async function createBrand(data: BrandData, token: string) {
  const response = await axios.post('/api/brands', {
    brand_name: data.brandName,
    image_url: data.imageUrl,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}


interface HeaderBrandResponse {
  status: boolean;
  brands: BrandProps[];
}

export async function showBrandListName(): Promise<BrandProps[]> {
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


interface BrandLogosResponse {
  status: boolean;
  brandLogo: BrandProps[];
}

export async function BrandLogos(): Promise<BrandProps[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brands/brandlogo/`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch brands');
  }

  const data: BrandLogosResponse = await res.json();
  return data.brandLogo;
}


export interface UpdateBrandData {
  brandId: number;
  brandName?: string;
  imageUrl?: string;
}

export async function updateBrand(data: UpdateBrandData, token: string) {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brands/${data.brandId}`,
    {
      ...(data.brandName && { brand_name: data.brandName }),
      ...(data.imageUrl && { image_url: data.imageUrl }),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}


interface DeleteBrandResponse {
  status: boolean;
}


export async function deleteBrand(brandId: number, token: string): Promise<DeleteBrandResponse> {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brands/${brandId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}
