'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { api, getErrorMessage } from '@/lib/api';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
  onClose: () => void;
}

export function DeleteProductDialog({ product, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setLoading(true);
    try {
      await api.deleteProduct(product.id);
      router.refresh();
      onClose();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Delete Product" onClose={onClose}>
      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete <span className="font-medium text-gray-900">{product.name}</span>? This action cannot be undone.
      </p>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={handleDelete}>Delete</Button>
      </div>
    </Modal>
  );
}
