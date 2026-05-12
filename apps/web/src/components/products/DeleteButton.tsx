'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DeleteProductDialog } from './DeleteProductDialog';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
}

export function DeleteButton({ product }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" className="text-xs px-3 py-1" onClick={() => setOpen(true)}>
        Delete
      </Button>
      {open && (
        <DeleteProductDialog product={product} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
