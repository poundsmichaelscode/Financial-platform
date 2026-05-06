'use client';

import { memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { usePortfolioMetrics } from '../hooks/usePortfolioMetrics';

export const PortfolioTable = memo(function PortfolioTable() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const { rows, totalValue, totalPnl } = usePortfolioMetrics();
  const virtualizer = useVirtualizer({ count: rows.length, getScrollElement: () => parentRef.current, estimateSize: () => 48, overscan: 12 });

  return (
    <section className="rounded-2xl border border-zinc-800 bg-slate-950">
      <div className="border-b border-zinc-800 p-4">
        <h2 className="text-sm font-semibold text-white">Portfolio</h2>
        <p className="text-xs text-zinc-500">Value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} · P&L: ${totalPnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
      </div>
      <div className="grid grid-cols-6 border-b border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-500">
        <span>Symbol</span><span>Qty</span><span>Avg</span><span>Price</span><span>Value</span><span>P&L</span>
      </div>
      <div ref={parentRef} className="h-[260px] overflow-auto">
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div key={row.symbol} className="grid grid-cols-6 px-4 py-3 text-sm text-zinc-300" style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}>
                <span className="font-medium text-white">{row.symbol}</span>
                <span>{row.quantity}</span>
                <span>${row.avgPrice.toLocaleString()}</span>
                <span>${row.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span>${row.marketValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span className={row.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>${row.pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
