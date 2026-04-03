export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { deleteGalleryImage } from '@/lib/db';

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ programId: string; imageId: string }> }) {
  try {
    const { imageId } = await params;
    const url = deleteGalleryImage(imageId);
    // Try to delete physical file
    if (url && url.startsWith('/uploads/')) {
      try { fs.unlinkSync(path.join(process.cwd(), 'public', url)); } catch {}
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
