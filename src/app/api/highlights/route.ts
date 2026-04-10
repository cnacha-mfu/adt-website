export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getAllHighlights, createHighlight } from '@/lib/db';

export async function GET() {
  try {
    const highlights = await getAllHighlights();
    return NextResponse.json({ highlights });
  } catch (err) {
    console.error('[GET /api/highlights]', err);
    return NextResponse.json({ error: 'Failed to fetch highlights' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const highlight = await createHighlight(body);
    return NextResponse.json({ highlight }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/highlights]', err);
    return NextResponse.json({ error: 'Failed to create highlight' }, { status: 500 });
  }
}
