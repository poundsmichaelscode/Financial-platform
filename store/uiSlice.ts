import type { StateCreator } from 'zustand';
import type { Timeframe } from '@/features/charts/types';

export type UiState = {
  activeSymbol: string;
  timeframe: Timeframe;
  layout: { left: number; right: number; bottom: number };
  setActiveSymbol: (symbol: string) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setLayout: (layout: { left: number; right: number; bottom: number }) => void;
};

export const createUiSlice: StateCreator<UiState> = (set) => ({
  activeSymbol: 'BINANCE:BTCUSDT',
  timeframe: '1m',
  layout: { left: 290, right: 380, bottom: 360 },
  setActiveSymbol: (activeSymbol) => set({ activeSymbol }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setLayout: (layout) => set({ layout })
});
