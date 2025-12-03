import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== 'ARTISAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, description, price, category, stock, imageUrl } = body;
    if (!name || price == null) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const images = Array.isArray(body.images) && body.images.length ? body.images : (imageUrl ? [String(imageUrl)] : []);
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(String(price)),
        images,
        category: category || 'OTHER',
        tags: [],
        stock: parseInt(String(stock || '0')),
        artisan: { connect: { id: (session as any).user.id } },
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
