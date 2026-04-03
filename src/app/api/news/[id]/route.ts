export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { updateNews, deleteNews } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const news = updateNews(id, body);
    if (!news) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }
    return NextResponse.json({ news });
  } catch (err) {
    console.error('[PUT /api/news/[id]]', err);
    return NextResponse.json({ error: 'Failed to update news item' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteNews(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/news/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete news item' }, { status: 500 });
  }
}
