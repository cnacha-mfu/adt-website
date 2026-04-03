export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { updateStaff, deleteStaff } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const staff = updateStaff(id, body);
    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }
    return NextResponse.json({ staff });
  } catch (err) {
    console.error('[PUT /api/staff/[id]]', err);
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteStaff(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/staff/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
  }
}
