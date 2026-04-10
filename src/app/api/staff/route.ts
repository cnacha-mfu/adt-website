export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getAllStaff, createStaff } from '@/lib/db';

export async function GET() {
  try {
    const staff = await getAllStaff();
    return NextResponse.json({ staff });
  } catch (err) {
    console.error('[GET /api/staff]', err);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const staff = await createStaff(body);
    return NextResponse.json({ staff }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/staff]', err);
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
  }
}
