import type { PaginatedProducts, Product } from '@/types/product';
import { PaginationControls } from './PaginationControls';
import { DeleteButton } from './DeleteButton';

interface Props {
  data: PaginatedProducts;
  page: number;
}

export function ProductsTable({ data, page }: Props) {
  const { items, meta } = data;

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">No products yet</td>
              </tr>
            ) : (
              items.map((product: Product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.description ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <DeleteButton product={product} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && (
        <PaginationControls page={page} totalPages={meta.totalPages} total={meta.total} />
      )}
    </div>
  );
}
