import axios, { isAxiosError } from 'axios';
import type { PaginatedProducts, Product, CreateProductData } from '@/types/product';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
});

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const msg = err.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
  }
  return err instanceof Error ? err.message : 'Something went wrong';
}

export const api = {
  getProducts: (page: number, limit: number) =>
    client.get<PaginatedProducts>(`/products`, { params: { page, limit } }).then(r => r.data),

  createProduct: (data: CreateProductData) =>
    client.post<Product>('/products', data).then(r => r.data),

  deleteProduct: (id: string) =>
    client.delete(`/products/${id}`),
};
