'use client';

import { memo, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { generateMockStocks, type ScreenerStock } from '../utils/generateMockStocks';
import { useScreenerFilter, type ScreenerFilters } from '../hooks/useScreenerFilter';
import { SparklineCell } from './SparklineCell';

export const ScreenerTable = memo(function ScreenerTable() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<ScreenerFilters>({ search: '', sector: 'All', minMarketCap: 0, maxPe: 100, minVolume: 0 });
  const [sortKey, setSortKey] = useState<keyof ScreenerStock>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const stocks = useMemo(() => generateMockStocks(5000), []);
  const rows = useScreenerFilter(stocks, filters, sortKey, sortDirection);
  const virtualizer = useVirtualizer({ count: rows.length, getScrollElement: () => parentRef.current, estimateSize: () => 52, overscan: 16 });

  function sortBy(key: keyof ScreenerStock) {
    if (key === sortKey) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDirection('desc');
    }
  }

  return (
    <section className="h-full overflow-hidden rounded-2xl border border-zinc-800 bg-slate-950">
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Stock Screener</h2>
          <p className="text-xs text-zinc-500">{rows.length.toLocaleString()} visible from 5,000 instruments</p>
        </div>
        <div className="flex gap-2">
          <select value={filters.sector} onChange={(event) => setFilters((prev) => ({ ...prev, sector: event.target.value }))} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none">
            {['All', 'Technology', 'Finance', 'Energy', 'Healthcare', 'Consumer', 'Industrial'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input value={filters.search} onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))} placeholder="Search symbol..." className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-zinc-800 bg-slate-950 px-4 py-2 text-xs font-medium text-zinc-500">
        <button onClick={() => sortBy('symbol')} className="text-left">Symbol</button>
        <button onClick={() => sortBy('name')} className="text-left">Name</button>
        <button onClick={() => sortBy('sector')} className="text-left">Sector</button>
        <button onClick={() => sortBy('price')} className="text-left">Price</button>
        <button onClick={() => sortBy('marketCap')} className="text-left">Market Cap</button>
        <button onClick={() => sortBy('volume')} className="text-left">Volume</button>
        <span>Sparkline</span>
      </div>
      <div ref={parentRef} className="h-[calc(100%-104px)] overflow-auto">
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div key={row.symbol} className="grid grid-cols-7 items-center border-b border-zinc-900 px-4 py-3 text-sm text-zinc-300" style={{ position: 'absolute', top: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}>
                <span className="font-medium text-white">{row.symbol}</span>
                <span>{row.name}</span>
                <span>{row.sector}</span>
                <span>${row.price.toFixed(2)}</span>
                <span>${row.marketCap.toLocaleString()}</span>
                <span>{row.volume.toLocaleString()}</span>
                <SparklineCell values={row.sparkline} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
