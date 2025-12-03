import { prisma } from '@/lib/db';
import Link from 'next/link';

function formatPrice(p: number) {
  return `$${p.toFixed(2)}`;
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    include: { artisan: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: 'desc' },
    take: 24,
  });

  return (
    <>
      <header className="hero">
        <div className="container">
          <h1>Discover Unique Handcrafted Treasures</h1>
          <p>Connect directly with talented artisans and find sustainable, one-of-a-kind products made with passion and care.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link href="/" className="btn btn-primary">Shop Now</Link>
            <Link href="/our-story" className="btn btn-secondary">Meet the Artisans</Link>
          </div>
        </div>
      </header>

      <main className="container">
        <h2 className="section-title">Explore Products</h2>

        <div className="product-grid">
          {products.map((p: any) => (
            <article className="product-card" key={p.id}>
              <div
                className={p.images && p.images.length ? "card-image has-image" : "card-image"}
                style={{ backgroundImage: p.images && p.images.length ? `url('${p.images[0]}')` : undefined }}
              ></div>
              <div className="card-content">
                <span className="category">{p.category ?? 'Other'}</span>
                <h3 className="product-title"><Link href={`/product/${p.id}`}>{p.name}</Link></h3>
                <p className="artisan">by {p.artisan?.name ?? 'Unknown'}</p>
                <div className="card-footer">
                  <span className="price">{formatPrice(p.price)}</span>
                  <span className="rating">
                    {p.reviews && p.reviews.length ? (
                      (() => {
                        const avg = p.reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / p.reviews.length;
                        return `★ ${avg.toFixed(1)} (${p.reviews.length})`;
                      })()
                    ) : (
                      'No reviews'
                    )}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}