const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Running DB seed...');

  const artisanEmail = 'artisan@example.com';
  const plainPassword = 'password123';
  const hashed = bcrypt.hashSync(plainPassword, 10);

  // Upsert an artisan user
  const artisan = await prisma.user.upsert({
    where: { email: artisanEmail },
    update: {
      name: 'Demo Artisan',
      password: hashed,
      role: 'ARTISAN',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
      bio: 'Demo artisan for testing filters and products.'
    },
    create: {
      name: 'Demo Artisan',
      email: artisanEmail,
      password: hashed,
      role: 'ARTISAN',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
      bio: 'Demo artisan for testing filters and products.'
    }
  });

  // Delete any existing products for this artisan (makes seed idempotent)
  await prisma.product.deleteMany({ where: { artisanId: artisan.id } });

  const products = [
    {
      name: 'Handmade Silver Necklace',
      description: 'A delicate handmade silver necklace with a small gemstone charm.',
      price: 49.99,
      images: [
        'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=1000&q=80'
      ],
      category: 'JEWELRY',
      tags: ['silver', 'necklace', 'gift'],
      stock: 12,
    },
    {
      name: 'Ceramic Vase',
      description: 'Wheel-thrown ceramic vase with a matte glaze finish.',
      price: 34.5,
      images: [
        'https://images.unsplash.com/photo-1505691723518-36a0bdc9f7a6?w=1000&q=80'
      ],
      category: 'HOME',
      tags: ['ceramic', 'vase', 'home'],
      stock: 8,
    },
    {
      name: 'Wool Scarf',
      description: 'Cozy hand-knitted wool scarf in neutral tones.',
      price: 29.0,
      images: [
        'https://images.unsplash.com/photo-1514996937319-344454492b37?w=1000&q=80'
      ],
      category: 'APPAREL',
      tags: ['wool', 'scarf', 'knit'],
      stock: 20,
    },
    {
      name: 'Abstract Print',
      description: 'Limited edition abstract art print, signed by the artist.',
      price: 75.0,
      images: [
        'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1000&q=80'
      ],
      category: 'ART',
      tags: ['print', 'art', 'limited'],
      stock: 5,
    },
    {
      name: 'Hand-poured Candle',
      description: 'Soy wax candle with a calming lavender scent.',
      price: 15.5,
      images: [
        'https://images.unsplash.com/photo-1505576391880-6b3b1c54c7a1?w=1000&q=80'
      ],
      category: 'OTHER',
      tags: ['candle', 'soy', 'scented'],
      stock: 30,
    }
  ];

  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        images: p.images,
        category: p.category,
        tags: p.tags,
        stock: p.stock,
        artisan: { connect: { id: artisan.id } },
      },
    });
    console.log('Created product:', created.id, created.name);
  }

  console.log('Seed completed. Artisan login:', artisanEmail, 'password:', plainPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
