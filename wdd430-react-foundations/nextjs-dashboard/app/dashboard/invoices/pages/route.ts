import { NextResponse } from 'next/server';
import { fetchInvoicesPages } from '@/app/lib/data';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') ?? '';
    const totalPages = await fetchInvoicesPages(query);
    return NextResponse.json({ totalPages });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
