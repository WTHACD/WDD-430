import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'));
    const limit = Math.min(Number(url.searchParams.get('limit') || '24'), 100);
    const q = url.searchParams.get('q') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const minPrice = Number(url.searchParams.get('minPrice') || '0');
    const maxPriceParam = url.searchParams.get('maxPrice');
    const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
    const minRating = Number(url.searchParams.get('minRating') || '0');
    const sort = url.searchParams.get('sort') || 'createdAt_desc';
    const skip = (page - 1) * limit;

    const where: any = { stock: { gt: 0 } };
    if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
    if (category) where.category = category;
    if (minPrice) where.price = { ...(where.price || {}), gte: minPrice };
    if (maxPrice !== undefined) where.price = { ...(where.price || {}), lte: maxPrice };

    const orderBy: Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput> =
      sort === 'price_asc' ? { price: 'asc' } : sort === 'price_desc' ? { price: 'desc' } : { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      include: { artisan: { select: { id: true, name: true } }, reviews: { select: { rating: true } } },
      orderBy,
      skip,
      take: limit,
    });

    // Optionally filter by minRating after fetching (simple approach)
    const filtered = products.filter((p) => {
      if (!minRating) return true;
      const avg = p.reviews && p.reviews.length ? p.reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / p.reviews.length : 0;
      return avg >= minRating;
    });

    const total = await prisma.product.count({ where });

    const items = filtered.map((p) => {
      const avg = p.reviews && p.reviews.length ? p.reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / p.reviews.length : null;
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        images: p.images,
        artisan: p.artisan,
        avgRating: avg,
        reviewsCount: p.reviews.length,
        category: p.category,
        stock: p.stock,
      };
    });

    return NextResponse.json({ items, total, page, limit });
  } catch (err) {
    console.error('GET /api/products error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
