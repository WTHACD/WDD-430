import { prisma } from '@/lib/db';
import ProductCard from '@/app/components/ProductCard';
import EditBio from '@/app/components/EditBio';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function ArtisanProfile({ params }: any) {
  // In some Next.js setups `params` can be a Promise — await it to be safe
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  if (!id) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Invalid artisan</h2>
        <p>Please open an artisan profile from the <a href="/our-story">Meet the Artisans</a> page or go <a href="/">home</a>.</p>
      </div>
    );
  }

  const artisan = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      role: true,
      products: { select: { id: true, name: true, images: true, price: true }, take: 24 },
    } as any,
  });

  if (!artisan) return <div style={{ padding: 24 }}>Artisan not found</div>;

  const session = (await getServerSession(authOptions as any)) as any;
  const isOwner = session?.user?.id === artisan.id;

  return (
    <main className="container">
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 24 }}>
        <div style={{ width: 260 }}>
          <div style={{ width: '100%', height: 260, overflow: 'hidden', borderRadius: 8 }}>
            <img src={artisan.avatar ?? '/avatar-placeholder.png'} alt={artisan.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ cursor: 'pointer' }}>
              <h2 style={{ marginTop: 12 }}>{artisan.name}</h2>
              <div style={{ color: '#666', fontSize: 13 }}>{artisan.role}</div>
            </div>
          </Link>
          {isOwner && <div style={{ marginTop: 8 }}><EditBio artisanId={artisan.id} initialBio={artisan.bio ?? ''} /></div>}
        </div>

        <div style={{ flex: 1 }}>
          <h3>About</h3>
          <p style={{ color: '#444' }}>{artisan.bio ? artisan.bio : 'This artisan has not added an About/Biography yet.'}</p>

          <h3 style={{ marginTop: 24 }}>Products</h3>
          <div className="product-grid" style={{ marginTop: 12 }}>
            {Array.isArray(artisan.products) && (artisan.products as any).length > 0 ? (artisan.products as any).map((p: any) => (
              <ProductCard key={p.id} product={{ id: p.id, name: p.name, price: p.price, images: p.images, artisan: { id: artisan.id, name: artisan.name } }} />
            )) : <div>No products yet</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
