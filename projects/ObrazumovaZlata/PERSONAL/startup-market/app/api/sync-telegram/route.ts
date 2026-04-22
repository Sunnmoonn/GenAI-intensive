import { NextResponse } from 'next/server';
import { syncTelegram } from '@/scrapers/telegram';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  const secret = req.headers.get('x-sync-secret');
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await syncTelegram();
    const total = Object.values(results).reduce((a, b) => a + b, 0);
    return NextResponse.json({ ok: true, added: total, channels: results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
