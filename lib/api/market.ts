import type { Candle, Timeframe } from '@/features/charts/types';
import { MAX_CANDLE_HISTORY } from '@/lib/constants';

export async function fetchHistoricalCandles(symbol: string, timeframe: Timeframe): Promise<Candle[]> {
  const response = await fetch(`/api/market/history?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to load historical candles');
  const data = (await response.json()) as { candles: Candle[] };
  return data.candles.slice(-MAX_CANDLE_HISTORY);
}
