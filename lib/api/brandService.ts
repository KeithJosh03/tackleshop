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


export async function showBrand () {
  const response = await axios.get('/api/brands');
  return response.data
}