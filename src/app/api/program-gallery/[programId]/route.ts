export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { getGallery, addGalleryImage } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ programId: string }> }) {
  try {
    const { programId } = await params;
    return NextResponse.json({ images: await getGallery(programId) });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ programId: string }> }) {
  try {
    const { programId } = await params;
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const caption = (formData.get('caption') as string) ?? '';
    const captionTH = (formData.get('captionTH') as string) ?? '';

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const ext = path.extname(file.name) || '.jpg';
    const filename = `${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'programs', programId, 'gallery');
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(bytes));

    const url = `/uploads/programs/${programId}/gallery/${filename}`;
    const image = await addGalleryImage(programId, url, caption, captionTH);
    return NextResponse.json({ image });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
