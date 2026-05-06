import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const metric = await request.json();
  console.log('[perf.metric]', metric);
  return NextResponse.json({ ok: true });
}
