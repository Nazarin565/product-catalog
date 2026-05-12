import type { PaginatedProducts, Product, CreateProductData } from '@/types/product';

const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';

export const serverApi = {
  getProducts: async (page: number, limit: number): Promise<PaginatedProducts> => {
    const url = new URL('/products', BASE_URL);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(limit));
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    return res.json();
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create product: ${res.status}`);
    return res.json();
  },

  deleteProduct: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`);
  },
};
