import type { StateCreator } from 'zustand';
import type { Tick } from '@/features/charts/types';

export type PriceState = {
  prices: Map<string, Tick>;
  lastDirection: Map<string, 'up' | 'down' | 'flat'>;
  updateTicks: (ticks: Tick[]) => void;
  removeSymbol: (symbol: string) => void;
};

export const createPriceSlice: StateCreator<PriceState> = (set, get) => ({
  prices: new Map(),
  lastDirection: new Map(),

  updateTicks: (ticks) => {
    const currentPrices = get().prices;
    const currentDirections = get().lastDirection;
    const nextPrices = new Map(currentPrices);
    const nextDirections = new Map(currentDirections);

    for (const tick of ticks) {
      const previous = currentPrices.get(tick.symbol);
      const direction = !previous ? 'flat' : tick.price > previous.price ? 'up' : tick.price < previous.price ? 'down' : 'flat';
      nextPrices.set(tick.symbol, tick);
      nextDirections.set(tick.symbol, direction);
    }

    set({ prices: nextPrices, lastDirection: nextDirections });
  },

  removeSymbol: (symbol) => {
    const prices = new Map(get().prices);
    const lastDirection = new Map(get().lastDirection);
    prices.delete(symbol);
    lastDirection.delete(symbol);
    set({ prices, lastDirection });
  }
});
