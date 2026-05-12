'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CreateProductDialog } from './CreateProductDialog';

export function ProductsActions() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCreate(true)}>Create Product</Button>
      {showCreate && (
        <CreateProductDialog onClose={() => setShowCreate(false)} />
      )}
    </>
  );
}
