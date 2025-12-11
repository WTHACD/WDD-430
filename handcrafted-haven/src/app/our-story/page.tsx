import { prisma } from '@/lib/db';
import ArtisanCard from '@/app/components/ArtisanCard';

export default async function OurStoryPage() {
  // Fetch artisans and a few sample products
  const artisans = await prisma.user.findMany({
    where: { role: 'ARTISAN' },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      products: { select: { id: true, name: true, images: true }, take: 4 },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <main className="container">
      <div style={{ margin: '24px 0' }}>
        <h1>Meet the Artisans</h1>
        <p style={{ color: '#666', marginTop: 8 }}>Profiles of our talented artisans and a sample of their work. Learn about their process, values and the stories behind their crafts.</p>
      </div>

      <section style={{ marginTop: 24 }}>
        <div className="product-grid">
          {artisans.map((a) => (
            <ArtisanCard key={a.id} artisan={{ id: a.id, name: a.name, avatar: a.avatar, bio: a.bio ?? undefined, products: a.products }} />
          ))}
        </div>
      </section>
    </main>
  );
}
