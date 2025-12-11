"use client";

import Link from 'next/link';
import StarRating from '@/app/components/StarRating';

type ProductSummary = {
  id: string;
  name: string;
  price: number;
  images?: string[];
  artisan?: { id: string; name: string } | null;
  avgRating?: number | null;
  reviewsCount?: number;
  category?: string | null;
};

export default function ProductCard({ product }: { product: ProductSummary }) {
  const avg = product.avgRating ?? 0;
  return (
    <article className="product-card">
      <Link href={`/product/${product.id}`}>
        <div style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
          <div className="card-image has-image">
            <img src={product.images?.[0] ?? '/placeholder.jpg'} alt={product.name} />
          </div>
          <h3 className="product-title" style={{ marginTop: 8 }}>{product.name}</h3>
        </div>
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div style={{ fontWeight: 700 }}>{`$${product.price.toFixed(2)}`}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <StarRating readOnly value={avg ?? 0} size={16} />
          <div style={{ color: '#666', fontSize: 12 }}>{product.reviewsCount ? `(${product.reviewsCount})` : ''}</div>
        </div>
      </div>
    </article>
  );
}
