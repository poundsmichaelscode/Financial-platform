import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createPriceSlice, type PriceState } from './priceSlice';
import { createPortfolioSlice, type PortfolioState } from './portfolioSlice';
import { createUiSlice, type UiState } from './uiSlice';
import { createWatchlistSlice, type WatchlistState } from './watchlistSlice';

export type AppStore = PriceState & PortfolioState & UiState & WatchlistState;

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((...args) => ({
    ...createPriceSlice(...args),
    ...createPortfolioSlice(...args),
    ...createUiSlice(...args),
    ...createWatchlistSlice(...args)
  }))
);
