import { NextResponse } from 'next/server';
import { generateWeeklySummary } from '@/lib/news-summary';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  const secret = req.headers.get('x-sync-secret');
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await generateWeeklySummary();
    return NextResponse.json({ ok: true, length: summary.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
