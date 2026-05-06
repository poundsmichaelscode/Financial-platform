'use client';

import { memo } from 'react';
import { useAppStore } from '@/store';
import type { Timeframe } from '../types';

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

export const ChartToolbar = memo(function ChartToolbar() {
  const symbol = useAppStore((state) => state.activeSymbol);
  const timeframe = useAppStore((state) => state.timeframe);
  const setTimeframe = useAppStore((state) => state.setTimeframe);

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
      <div>
        <h2 className="text-sm font-semibold text-white">{symbol}</h2>
        <p className="text-xs text-zinc-500">Candles, volume and worker-calculated indicators</p>
      </div>
      <div className="flex gap-1">
        {TIMEFRAMES.map((item) => (
          <button key={item} onClick={() => setTimeframe(item)} className={item === timeframe ? 'rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-black' : 'rounded-md bg-zinc-900 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-800'}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
});
