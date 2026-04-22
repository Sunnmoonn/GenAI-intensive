import { NextRequest, NextResponse } from 'next/server';
import { getCurrentWeeklyTop, getCurrentMonthlyTop } from '@/lib/rankings';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get('period') ?? 'week';
  try {
    const data = period === 'month' ? getCurrentMonthlyTop(10) : getCurrentWeeklyTop(10);
    return NextResponse.json({ data, period });
  } catch (err) {
    console.error('[api/top]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
