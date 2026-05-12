export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  createdAt: string;
}

export interface PaginatedProducts {
  items: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
}
