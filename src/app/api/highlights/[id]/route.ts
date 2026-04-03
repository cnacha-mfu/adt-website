export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { updateHighlight, deleteHighlight } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const highlight = updateHighlight(id, body);
    if (!highlight) {
      return NextResponse.json({ error: 'Highlight not found' }, { status: 404 });
    }
    return NextResponse.json({ highlight });
  } catch (err) {
    console.error('[PUT /api/highlights/[id]]', err);
    return NextResponse.json({ error: 'Failed to update highlight' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteHighlight(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/highlights/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete highlight' }, { status: 500 });
  }
}
