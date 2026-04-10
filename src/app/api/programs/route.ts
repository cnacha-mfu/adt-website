export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getAllPrograms } from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json({ programs: await getAllPrograms() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
