export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getAllNews, createNews } from '@/lib/db';

export async function GET() {
  try {
    const news = await getAllNews();
    return NextResponse.json({ news });
  } catch (err) {
    console.error('[GET /api/news]', err);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const news = await createNews(body);
    return NextResponse.json({ news }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/news]', err);
    return NextResponse.json({ error: 'Failed to create news item' }, { status: 500 });
  }
}
