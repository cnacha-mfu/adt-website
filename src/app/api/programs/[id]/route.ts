export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getProgramById, updateProgram } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = getProgramById(id);
  if (!program) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ program });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = updateProgram(id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ program: updated });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
