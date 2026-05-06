import type { StateCreator } from 'zustand';

export type Holding = {
  symbol: string;
  quantity: number;
  avgPrice: number;
};

export type PortfolioState = {
  holdings: Holding[];
  addHolding: (holding: Holding) => void;
  removeHolding: (symbol: string) => void;
  updateHolding: (symbol: string, data: Partial<Holding>) => void;
};

export const createPortfolioSlice: StateCreator<PortfolioState> = (set) => ({
  holdings: [
    { symbol: 'BINANCE:BTCUSDT', quantity: 0.45, avgPrice: 62000 },
    { symbol: 'BINANCE:ETHUSDT', quantity: 4.2, avgPrice: 3100 },
    { symbol: 'BINANCE:SOLUSDT', quantity: 80, avgPrice: 135 },
    { symbol: 'BINANCE:BNBUSDT', quantity: 18, avgPrice: 460 },
    { symbol: 'BINANCE:XRPUSDT', quantity: 2500, avgPrice: 0.58 }
  ],
  addHolding: (holding) => set((state) => ({ holdings: [...state.holdings, holding] })),
  removeHolding: (symbol) => set((state) => ({ holdings: state.holdings.filter((item) => item.symbol !== symbol) })),
  updateHolding: (symbol, data) => set((state) => ({
    holdings: state.holdings.map((item) => (item.symbol === symbol ? { ...item, ...data } : item))
  }))
});
