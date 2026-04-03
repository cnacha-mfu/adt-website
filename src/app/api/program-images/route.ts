export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getProgramImages, setProgramImage } from '@/lib/db';

export async function GET() {
  try {
    const images = getProgramImages();
    return NextResponse.json({ images });
  } catch (err) {
    console.error('[GET /api/program-images]', err);
    return NextResponse.json({ error: 'Failed to fetch program images' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { programId, url } = await request.json();
    if (!programId || !url) {
      return NextResponse.json({ error: 'programId and url are required' }, { status: 400 });
    }
    setProgramImage(programId, url);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PUT /api/program-images]', err);
    return NextResponse.json({ error: 'Failed to update program image' }, { status: 500 });
  }
}
