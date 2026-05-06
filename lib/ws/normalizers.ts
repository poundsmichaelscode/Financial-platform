import type { Tick } from '@/features/charts/types';

export function normalizeFinnhubTrade(payload: unknown): Tick[] {
  const item = payload as { data?: Array<{ s: string; p: number; v?: number; t: number }> };
  if (!item?.data || !Array.isArray(item.data)) return [];

  return item.data.map((trade) => ({
    symbol: trade.s,
    price: trade.p,
    volume: trade.v,
    timestamp: trade.t
  }));
}
