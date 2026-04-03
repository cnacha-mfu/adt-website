import { NextResponse } from 'next/server';
import { readdirSync, statSync, existsSync } from 'fs';
import path from 'path';

interface MediaFile {
  url: string;
  name: string;
  folder: string;
}

function walk(dir: string, base: string, results: MediaFile[]) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, `${base}/${entry}`, results);
    } else {
      const ext = path.extname(entry).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
        results.push({
          url: `/uploads/${base ? base + '/' : ''}${entry}`,
          name: entry,
          folder: base || 'misc',
        });
      }
    }
  }
}

export async function GET() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const files: MediaFile[] = [];
  walk(uploadsDir, '', files);
  // newest first (by filename timestamp suffix)
  files.sort((a, b) => b.name.localeCompare(a.name));
  return NextResponse.json({ files });
}
