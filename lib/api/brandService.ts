import { apiClient } from './apiClient';
import { BrandProps } from '@/types/brandType';

// Interfaces
export interface BrandData {
  brandName: string;
  imageUrl: string;
}

export interface UpdateBrandData {
  brandId: number;
  brandName?: string;
  imageUrl?: string;
}

interface HeaderBrandResponse {
  status: boolean;
  brands: BrandProps[];
}

interface BrandLogosResponse {
  status: boolean;
  brandLogo: BrandProps[];
}

interface DeleteBrandResponse {
  status: boolean;
}

/* ── Service Functions ── */

/**
 * Creates a new brand (Protected)
 */
export async function createBrand<T = unknown>(data: BrandData, token: string): Promise<T | null> {
  return apiClient<T>('/api/brands', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      brand_name: data.brandName,
      image_url: data.imageUrl,
    }),
  });
}

/**
 * Fetches brands for navigation menus (Cached & Revalidated)
 */
export async function BrandListNameSearchHeader(): Promise<BrandProps[]> {
  const data = await apiClient<HeaderBrandResponse>('/api/brands/', {
    next: { revalidate: 3600, tags: ['header-brands'] },
  });

  return data?.brands || [];
}

/**
 * Fetches brand logos for showcase sections (Cached for 24 hours with Tag Support)
 */
export async function BrandLogos(): Promise<BrandProps[]> {
  const data = await apiClient<BrandLogosResponse>('/api/brands/brandlogo/', {
    next: { revalidate: 86400, tags: ['brand-logos'] },
  });

  return data?.brandLogo || [];
}

/**
 * Updates an existing brand (Protected)
 */
export async function updateBrand<T = unknown>(
  data: UpdateBrandData,
  token: string
): Promise<T | null> {
  return apiClient<T>(`/api/brands/${data.brandId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...(data.brandName && { brand_name: data.brandName }),
      ...(data.imageUrl && { image_url: data.imageUrl }),
    }),
  });
}

/**
 * Deletes a brand by ID (Protected)
 */
export async function deleteBrand(
  brandId: number,
  token: string
): Promise<DeleteBrandResponse | null> {
  return apiClient<DeleteBrandResponse>(`/api/brands/${brandId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}