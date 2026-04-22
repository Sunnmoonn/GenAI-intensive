import { NextRequest, NextResponse } from 'next/server';
import { syncYC } from '@/scrapers/yc';
import { syncProductHunt } from '@/scrapers/producthunt';
import { computeWeeklyTop } from '@/lib/rankings';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 min max for Vercel

export async function POST(req: NextRequest) {
  // Simple secret check to prevent unauthorized triggers
  const secret = req.headers.get('x-sync-secret');
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { source, full } = await req.json().catch(() => ({ source: 'yc', full: false })) as { source?: string; full?: boolean };

  try {
    let result;
    if (source === 'ph' || source === 'producthunt') {
      result = await syncProductHunt({ daysBack: 1 });
    } else {
      result = await syncYC({ fullSync: full ?? false });
    }

    await computeWeeklyTop();

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
