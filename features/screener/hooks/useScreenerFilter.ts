'use client';

import { useMemo } from 'react';
import type { ScreenerStock } from '../utils/generateMockStocks';

export type ScreenerFilters = {
  search: string;
  sector: string;
  minMarketCap: number;
  maxPe: number;
  minVolume: number;
};

export function useScreenerFilter(stocks: ScreenerStock[], filters: ScreenerFilters, sortKey: keyof ScreenerStock, sortDirection: 'asc' | 'desc') {
  return useMemo(() => {
    const search = filters.search.toLowerCase().trim();
    const filtered = stocks.filter((stock) => {
      if (search && !stock.symbol.toLowerCase().includes(search) && !stock.name.toLowerCase().includes(search)) return false;
      if (filters.sector !== 'All' && stock.sector !== filters.sector) return false;
      if (stock.marketCap < filters.minMarketCap) return false;
      if (stock.pe > filters.maxPe) return false;
      if (stock.volume < filters.minVolume) return false;
      return true;
    });

    filtered.sort((a, b) => {
      const first = a[sortKey];
      const second = b[sortKey];
      if (typeof first === 'number' && typeof second === 'number') return sortDirection === 'asc' ? first - second : second - first;
      return sortDirection === 'asc' ? String(first).localeCompare(String(second)) : String(second).localeCompare(String(first));
    });

    return filtered;
  }, [stocks, filters, sortKey, sortDirection]);
}
