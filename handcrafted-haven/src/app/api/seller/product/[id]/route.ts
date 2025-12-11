import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/db';
import { NextResponse } from 'next/server';

// Debug GET: return product by id so you can verify it exists (safe, temporary)
export async function GET(req: Request, context: any) {
  const { params } = context;
  // First try params, then fall back to parsing the URL path if params are missing
  const rawIdFromParams = params?.id ?? params?.nxtPid ?? Object.values(params ?? {})[0];
  let id = String(rawIdFromParams ?? '');
  if (!id) {
    try {
      const url = new URL(req.url);
      const parts = url.pathname.split('/').filter(Boolean);
      // Expecting ['api','seller','product','<id>']
      const idx = parts.indexOf('product');
      if (idx >= 0 && parts.length > idx + 1) {
        id = String(parts[idx + 1]);
      }
    } catch (e) {
      // ignore
    }
  }
  // eslint-disable-next-line no-console
  console.log('GET /api/seller/product - context.params =', params, 'resolved id =', id);
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('GET /api/seller/product error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  const { params } = context;
  const session = await getServerSession(authOptions as any);
  const userRole = (session as any)?.user?.role;
  if (!session || (userRole !== 'ARTISAN' && userRole !== 'artisan')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Robustly resolve the dynamic param name used by Next (may vary between dev/build)
  const rawIdPatch = params?.id ?? params?.nxtPid ?? Object.values(params ?? {})[0];
  let id = String(rawIdPatch ?? '');
  if (!id) {
    try {
      const url = new URL(req.url);
      const parts = url.pathname.split('/').filter(Boolean);
      const idx = parts.indexOf('product');
      if (idx >= 0 && parts.length > idx + 1) {
        id = String(parts[idx + 1]);
      }
    } catch (e) {
      // ignore
    }
  }
  // Debug: log incoming params and resolved id
  // eslint-disable-next-line no-console
  console.log('DELETE /api/seller/product - context.params =', params, 'rawId =', rawIdPatch, 'resolved id =', id);
  try {
    // ensure the artisan owns the product
    const product = await prisma.product.findUnique({ where: { id } });
    // Debug info: log session user id and product owner id to help diagnose ownership issues
    // eslint-disable-next-line no-console
    console.log('DELETE /api/seller/product/[id] - session.user.id:', (session as any).user?.id, 'product =', product);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (product.artisanId !== (session as any).user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log server error for debugging and return message when available
    // eslint-disable-next-line no-console
    console.error('DELETE /api/seller/product/[id] error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: any) {
  const { params } = context;
  const session = await getServerSession(authOptions as any);
  const userRolePatch = (session as any)?.user?.role;
  if (!session || (userRolePatch !== 'ARTISAN' && userRolePatch !== 'artisan')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Robustly resolve the dynamic param name for PATCH as well
  const rawIdPatch = params?.id ?? params?.nxtPid ?? Object.values(params ?? {})[0];
  let id = String(rawIdPatch ?? '');
  if (!id) {
    try {
      const url = new URL(req.url);
      const parts = url.pathname.split('/').filter(Boolean);
      const idx = parts.indexOf('product');
      if (idx >= 0 && parts.length > idx + 1) {
        id = String(parts[idx + 1]);
      }
    } catch (e) {
      // ignore
    }
  }
  // Debug: log resolved id for PATCH
  // eslint-disable-next-line no-console
  console.log('PATCH /api/seller/product - context.params =', params, 'rawId =', rawIdPatch, 'resolved id =', id);
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
