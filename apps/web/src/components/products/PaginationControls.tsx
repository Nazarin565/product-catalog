'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface Props {
  page: number;
  totalPages: number;
  total: number;
}

export function PaginationControls({ page, totalPages, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
      <span>Page {page} of {totalPages} · {total} total</span>
      <div className="flex gap-2">
        <Button variant="ghost" disabled={page <= 1} onClick={() => navigate(page - 1)}>Previous</Button>
        <Button variant="ghost" disabled={page >= totalPages} onClick={() => navigate(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
