import Link from 'next/link';

type ProductMini = {
  id: string;
  name: string;
  images?: string[];
};

type Artisan = {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  products?: ProductMini[];
};

export default function ArtisanCard({ artisan }: { artisan: Artisan }) {
  return (
    <article className="product-card" style={{ height: 'auto' }}>
      <Link href={`/artisan/${artisan.id}`}>
        <div style={{ cursor: 'pointer' }}>
          <div style={{ width: '100%', height: 180, overflow: 'hidden', borderRadius: 6 }}>
            <img src={artisan.avatar ?? '/avatar-placeholder.png'} alt={artisan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h3 style={{ marginTop: 10 }}>{artisan.name}</h3>
        </div>
      </Link>

      <div className="card-content" style={{ padding: 12 }}>
        <p style={{ color: '#666', marginBottom: 10 }}>{artisan.bio ? artisan.bio.slice(0, 180) : 'No bio available.'}</p>

        <div>
          <strong style={{ fontSize: 13 }}>Sample products</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {artisan.products && artisan.products.length ? artisan.products.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <img src={p.images?.[0] ?? '/placeholder.jpg'} alt={p.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6 }} />
              </Link>
            )) : <div style={{ color: '#999' }}>No products yet</div>}
          </div>
        </div>
      </div>
    </article>
  );
}
