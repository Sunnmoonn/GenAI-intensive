import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { startups } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const startup = db.select().from(startups).where(eq(startups.id, id)).get();
  if (!startup) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(startup);
}
