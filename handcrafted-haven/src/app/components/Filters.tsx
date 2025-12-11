"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import React from 'react';
import { formatCategory } from '@/lib/categories';

export default function Filters({ categories, defaultCategory }: { categories: string[]; defaultCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function onCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    const params = new URLSearchParams(Array.from(searchParams || []));
    if (val && val !== 'ALL') params.set('category', val);
    else params.delete('category');
    params.set('page', '1');
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="category-select" style={{ fontWeight: 600, marginRight: 6 }}>Category</label>
      <select id="category-select" value={defaultCategory || (searchParams?.get('category') ?? 'ALL')} onChange={onCategoryChange} style={{ padding: '8px 10px', borderRadius: 6 }}>
        <option value="ALL">All</option>
        {categories.map((c) => (
          <option key={c} value={c}>{formatCategory(c)}</option>
        ))}
      </select>
    </div>
  );
}
