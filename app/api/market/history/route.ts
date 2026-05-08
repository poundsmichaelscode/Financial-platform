import { NextResponse } from 'next/server';
import type { Timeframe } from '@/features/charts/types';

const FRAME_SECONDS: Record<Timeframe, number> = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
  '4h': 14400,
  '1D': 86400,
  '1W': 604800,
  '1M': 2592000,
  '1Y': 31536000,
};

function seedFromSymbol(symbol: string) {
  return Array.from(symbol).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') ?? 'BINANCE:BTCUSDT';
  const timeframe = (searchParams.get('timeframe') ?? '1m') as Timeframe;
  const frame = FRAME_SECONDS[timeframe] ?? 60;
  const now = Math.floor(Date.now() / 1000);
  const seed = seedFromSymbol(symbol);
  let price = 80 + seed * 8;

  const candles = Array.from({ length: 600 }).map((_, index) => {
    const time = now - (600 - index) * frame;
    const noise = Math.sin(index / 7) * 12 + Math.cos(index / 19) * 8 + (Math.random() - 0.5) * 10;
    const open = price;
    const close = Math.max(1, open + noise);
    const high = Math.max(open, close) + Math.random() * 8;
    const low = Math.min(open, close) - Math.random() * 8;
    const volume = Math.round(100000 + Math.random() * 800000);
    price = close;
    return { time, open, high, low, close, volume };
  });

  return NextResponse.json({ symbol, timeframe, candles });
}
