export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { resetToDefaults } from '@/lib/db';

export async function POST() {
  try {
    await resetToDefaults();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/reset]', err);
    return NextResponse.json({ error: 'Failed to reset to defaults' }, { status: 500 });
  }
}
