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
