import { prisma } from '@/lib/db';
import ProductCard from '@/app/components/ProductCard';
import Link from 'next/link';
import SearchBox from '@/app/components/SearchBox';

export default async function ProductsPage({ searchParams }: any) {
  // In some Next.js environments `searchParams` may be a Promise — await it first.
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? 1));
  const limit = Math.min(Number(resolvedSearchParams?.limit ?? 24), 48);
  const skip = (page - 1) * limit;
  const rawQ = resolvedSearchParams?.q ?? '';
  const q = typeof rawQ === 'string' ? rawQ.trim() : '';

  const where: any = { stock: { gt: 0 } };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  // DEBUG: log incoming search param to server console
  try {
    // eslint-disable-next-line no-console
    console.log(`[products page] search q=${JSON.stringify(q)}`);
  } catch (e) {}

  const products = await prisma.product.findMany({
    where,
    include: { artisan: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  try {
    // eslint-disable-next-line no-console
    console.log(`[products page] returned products=${products.length} (page=${page}, limit=${limit})`);
  } catch (e) {}

  const total = await prisma.product.count({ where: { stock: { gt: 0 } } });

  const items = products.map((p) => {
    const avg = p.reviews && p.reviews.length ? p.reviews.reduce((s, r) => s + (r.rating || 0), 0) / p.reviews.length : null;
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      images: p.images,
      artisan: p.artisan ? { id: p.artisan.id, name: p.artisan.name } : null,
      avgRating: avg,
      reviewsCount: p.reviews.length,
      category: p.category,
      stock: p.stock,
    };
  });

  const lastPage = Math.max(1, Math.ceil(total / limit));
  return (
    <main className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0' }}>
        <h1>Products</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <SearchBox defaultValue={q} />
          <div>
            <Link href="/">Back home</Link>
          </div>
        </div>
      </div>

      <div className="product-grid">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
        <Link href={`/products?page=${Math.max(1, page - 1)}&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="btn">Previous</Link>
        <div style={{ alignSelf: 'center' }}>Page {page} / {lastPage}</div>
        <Link href={`/products?page=${Math.min(lastPage, page + 1)}&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="btn">Next</Link>
      </div>
    </main>
  );
}
