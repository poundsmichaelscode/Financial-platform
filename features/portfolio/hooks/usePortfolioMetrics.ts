'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store';

export function usePortfolioMetrics() {
  const holdings = useAppStore((state) => state.holdings);
  const prices = useAppStore((state) => state.prices);

  return useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;
    const rows = holdings.map((holding) => {
      const price = prices.get(holding.symbol)?.price ?? holding.avgPrice;
      const marketValue = price * holding.quantity;
      const cost = holding.avgPrice * holding.quantity;
      const pnl = marketValue - cost;
      const pnlPercent = cost === 0 ? 0 : (pnl / cost) * 100;
      totalValue += marketValue;
      totalCost += cost;
      return { ...holding, price, marketValue, pnl, pnlPercent };
    });
    return {
      rows,
      totalValue,
      totalCost,
      totalPnl: totalValue - totalCost,
      totalPnlPercent: totalCost === 0 ? 0 : ((totalValue - totalCost) / totalCost) * 100
    };
  }, [holdings, prices]);
}
