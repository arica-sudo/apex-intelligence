import { NextResponse } from 'next/server';
import { addScan, getScanHistory, clearHistory } from '@/lib/history-store';

export async function GET() {
  return NextResponse.json({ history: getScanHistory() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    addScan(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE() {
  clearHistory();
  return NextResponse.json({ ok: true });
}

