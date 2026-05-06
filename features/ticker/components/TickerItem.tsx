'use client';

import { memo } from 'react';
import { useAppStore } from '@/store';

export const TickerItem = memo(function TickerItem({ symbol }: { symbol: string }) {
  const price = useAppStore((state) => state.prices.get(symbol));
  const direction = useAppStore((state) => state.lastDirection.get(symbol));
  const color = direction === 'up' ? 'text-emerald-400' : direction === 'down' ? 'text-red-400' : 'text-zinc-300';

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium text-zinc-500">{symbol}</span>
      <span className={`rounded px-2 py-0.5 font-mono transition-colors ${color} ${direction === 'up' ? 'price-flash-up' : direction === 'down' ? 'price-flash-down' : ''}`}>
        {price ? price.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'}
      </span>
    </div>
  );
});
