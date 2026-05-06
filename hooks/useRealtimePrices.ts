'use client';

import { useEffect, useMemo } from 'react';
import { MockMarketDataManager, WebSocketManager } from '@/lib/ws/WebSocketManager';
import { useAppStore } from '@/store';

export function useRealtimePrices(symbols: string[]) {
  const updateTicks = useAppStore((state) => state.updateTicks);
  const stableSymbols = useMemo(() => [...new Set(symbols)].sort(), [symbols]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

    const manager = token
      ? new WebSocketManager({
          url: `wss://ws.finnhub.io?token=${token}`,
          provider: 'finnhub',
          onTicks: updateTicks,
          onStatus: (status) => console.log('[market.ws]', status)
        })
      : new MockMarketDataManager(updateTicks, (status) => console.log('[market.ws]', status));

    manager.connect();
    stableSymbols.forEach((symbol) => manager.subscribe(symbol));

    return () => {
      stableSymbols.forEach((symbol) => manager.unsubscribe(symbol));
      manager.disconnect();
    };
  }, [stableSymbols, updateTicks]);
}
