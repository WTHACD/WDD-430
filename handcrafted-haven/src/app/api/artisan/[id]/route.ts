import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MAX_BIO_LENGTH = 2000;

function sanitizeBio(input: string) {
  // Basic sanitization: strip control chars and escape angle brackets
  const withoutControls = input.replace(/[\x00-\x1F\x7F]/g, '');
  const escaped = withoutControls.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.slice(0, MAX_BIO_LENGTH).trim();
}

export async function PATCH(req: Request, { params }: { params: { id: string } } | any) {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In some Next.js environments `params` may be a Promise — await it first
  const resolvedParams = await params;
  const artisanId = resolvedParams?.id;
  // Only the artisan themself or ADMIN can update
  const userId = session.user.id as string;
  const isAdmin = (session.user.role as string) === 'ADMIN';
  if (userId !== artisanId && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const rawBio = typeof body.bio === 'string' ? body.bio : '';
  const bio = sanitizeBio(rawBio);

  try {
    const updated = await prisma.user.update({ where: { id: artisanId }, data: { bio } as any });
    return NextResponse.json({ ok: true, bio: (updated as any).bio });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('Failed to update artisan bio', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(_req: Request, { params }: { params: { id: string } } | any) {
  try {
    const resolvedParams = await params;
    const artisan = await prisma.user.findUnique({
      where: { id: resolvedParams?.id },
      select: { id: true, name: true, avatar: true, bio: true } as any,
    });
    if (!artisan) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(artisan);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
