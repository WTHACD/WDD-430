import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReviewForm from '../ReviewForm';
import StarRating from '@/app/components/StarRating';

function formatPrice(p: number) {
  return `$${p.toFixed(2)}`;
}

export default async function ProductPage({ params }: any) {
  // In Next.js App Router params may be a promise; await to normalize
  const resolved = await params;
  let { id } = resolved as { id: string | string[] };
  const productId = Array.isArray(id) ? id[0] : id;
  if (!productId) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { artisan: true, reviews: { include: { user: true } } },
  });

  if (!product) return notFound();

  const avgRating = product.reviews && product.reviews.length
    ? (product.reviews.reduce((s, r) => s + (r.rating || 0), 0) / product.reviews.length)
    : null;

  return (
    <div className="container" style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 420px' }}>
          <div className={product.images && product.images.length ? 'card-image has-image' : 'card-image'} style={{ backgroundImage: product.images && product.images.length ? `url('${product.images[0]}')` : undefined }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: 8 }}>{product.name}</h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>{formatPrice(product.price)}</div>
            <div style={{ color: '#666' }}>{product.category}</div>
            {avgRating != null && <div style={{ color: '#FFC107' }}>★ {avgRating.toFixed(1)} ({product.reviews.length})</div>}
          </div>

          <div style={{ marginBottom: 12 }}>{product.description}</div>

          <div style={{ marginBottom: 12 }}>Stock: <strong>{product.stock}</strong></div>

          <div style={{ marginBottom: 18 }}>
            <div>By: <strong>{product.artisan?.name ?? 'Unknown'}</strong></div>
            {product.artisan?.email && (
              <div style={{ marginTop: 8 }}>
                <a className="btn" href={`mailto:${product.artisan.email}`}>Contact seller</a>
              </div>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            <h3>Reviews</h3>
            {(!product.reviews || product.reviews.length === 0) ? (
              <div style={{ color: '#666' }}>No reviews yet. Be the first to review this product.</div>
            ) : (
              product.reviews.map((r) => (
                <div key={r.id} style={{ borderTop: '1px solid #eee', padding: '12px 0' }}>
                  <div style={{ fontWeight: 700 }}>
                    <StarRating value={r.rating} readOnly size={18} />
                  </div>
                  {r.comment && <div style={{ marginTop: 8 }}>{r.comment}</div>}
                  <div style={{ marginTop: 6, color: '#666' }}>By: {r.user?.name ?? 'Anonymous'}</div>
                </div>
              ))
            )}

            <div style={{ marginTop: 18 }}>
              <h4>Write a review</h4>
              {/* Client component handles submission and router.refresh() */}
              <ReviewForm productId={product.id} />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <Link href="/" className="btn">Back to catalog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
