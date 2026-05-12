import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductsActions } from '@/components/products/ProductsActions';
import { serverApi } from '@/lib/server-api';

const LIMIT = 10;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let data;
  let error = '';
  try {
    data = await serverApi.getProducts(page, LIMIT);
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Failed to load products';
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <ProductsActions />
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {data && <ProductsTable data={data} page={page} />}
    </main>
  );
}
