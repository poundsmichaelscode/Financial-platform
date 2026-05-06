'use client';

import { memo } from 'react';
import { DEFAULT_SYMBOLS } from '@/lib/constants';
import { useRealtimePrices } from '@/hooks/useRealtimePrices';
import { TickerItem } from './TickerItem';

export const RealtimeTicker = memo(function RealtimeTicker({ symbols = DEFAULT_SYMBOLS }: { symbols?: string[] }) {
  useRealtimePrices(symbols);

  return (
    <div className="h-10 w-full overflow-hidden border-b border-zinc-800 bg-black">
      <div className="flex animate-ticker gap-8 whitespace-nowrap px-4 py-2">
        {[...symbols, ...symbols].map((symbol, index) => (
          <TickerItem key={`${symbol}-${index}`} symbol={symbol} />
        ))}
      </div>
    </div>
  );
});
