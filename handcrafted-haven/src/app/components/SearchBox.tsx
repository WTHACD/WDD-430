"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SearchBox({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [value, setValue] = useState<string>(defaultValue || (searchParams?.get('q') || ''));
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  function scheduleUpdate(newVal: string) {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams || []));
      if (newVal) params.set('q', newVal);
      else params.delete('q');
      // reset to first page on new search
      params.set('page', '1');
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
    }, 300);
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        aria-label="Search products"
        placeholder="Search products..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          scheduleUpdate(e.target.value.trim());
        }}
        style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
      />
      <button
        type="button"
        className="btn"
        onClick={() => {
          // immediate search
          if (debounceRef.current) window.clearTimeout(debounceRef.current);
          scheduleUpdate(value.trim());
        }}
      >
        Search
      </button>
    </div>
  );
}
