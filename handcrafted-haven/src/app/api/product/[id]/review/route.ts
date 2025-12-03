import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request, context: any) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const { rating, comment } = body;

    // Prefer params.id, but some client requests or Next versions may not populate it correctly.
    const params = context?.params;
    let productId = params?.id;
    if (!productId) {
      // Fallback: try to parse from the request URL
      try {
        const u = new URL(req.url);
        const m = u.pathname.match(/^\/api\/product\/([^\/]+)\/review\/?$/);
        if (m) productId = decodeURIComponent(m[1]);
      } catch (e) {
        // ignore
      }
    }

    if (!productId) {
      console.warn('Review POST called without product id in params; raw url=', req.url);
      return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    }

    const parsedRating = Number(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const userId = (session as any).user?.id;
    if (!userId) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

    // Sanitize and validate comment on the server to avoid storing HTML/JS payloads
    function sanitizeComment(input: any) {
      if (input == null) return undefined;
      let s = String(input);
      // Remove NULL bytes and control characters except newlines/tabs
      s = s.replace(/\x00/g, '');
      s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      // Trim and collapse long whitespace
      s = s.trim().replace(/\s{2,}/g, ' ');
      // Escape angle brackets to avoid injected HTML when data is rendered
      s = s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      // Limit length to reasonable maximum
      const MAX = 1000;
      if (s.length > MAX) s = s.slice(0, MAX);
      return s;
    }

    const safeComment = sanitizeComment(comment);

    try {
      const review = await prisma.review.create({
        data: {
          rating: parsedRating,
          comment: safeComment || undefined,
          product: { connect: { id: productId } },
          user: { connect: { id: userId } },
        },
      });

      return NextResponse.json({ ok: true, review }, { status: 201 });
    } catch (err: any) {
      // Unique constraint — user already reviewed this product
      if (err?.code === 'P2002') {
        return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 });
      }
      console.error('Create review error', err);
      return NextResponse.json({ error: 'Could not create review' }, { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
