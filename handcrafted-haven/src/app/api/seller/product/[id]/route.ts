import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, context: any) {
  const { params } = context;
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== 'ARTISAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = params?.id;
  try {
    // ensure the artisan owns the product
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (product.artisanId !== (session as any).user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: any) {
  const { params } = context;
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== 'ARTISAN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = params?.id as string;
  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (existing.artisanId !== (session as any).user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, stock, category, imageUrl, images } = body;
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        price: price != null ? parseFloat(String(price)) : existing.price,
        stock: stock != null ? parseInt(String(stock)) : existing.stock,
        category: category ?? existing.category,
        images: Array.isArray(images) && images.length ? images : (imageUrl ? [String(imageUrl)] : existing.images),
      },
    });
    return NextResponse.json({ product: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
