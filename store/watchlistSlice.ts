import type { StateCreator } from 'zustand';

export type Watchlist = {
  id: string;
  name: string;
  symbols: string[];
};

export type WatchlistState = {
  watchlists: Watchlist[];
  activeWatchlistId: string;
  setActiveWatchlist: (id: string) => void;
  reorderSymbols: (watchlistId: string, symbols: string[]) => void;
  addSymbolToWatchlist: (watchlistId: string, symbol: string) => void;
  removeSymbolFromWatchlist: (watchlistId: string, symbol: string) => void;
};

export const createWatchlistSlice: StateCreator<WatchlistState> = (set) => ({
  activeWatchlistId: 'crypto',
  watchlists: [
    { id: 'crypto', name: 'Crypto', symbols: ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:SOLUSDT', 'BINANCE:BNBUSDT', 'BINANCE:XRPUSDT'] },
    { id: 'majors', name: 'Majors', symbols: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'] }
  ],
  setActiveWatchlist: (id) => set({ activeWatchlistId: id }),
  reorderSymbols: (watchlistId, symbols) => set((state) => ({
    watchlists: state.watchlists.map((list) => (list.id === watchlistId ? { ...list, symbols } : list))
  })),
  addSymbolToWatchlist: (watchlistId, symbol) => set((state) => ({
    watchlists: state.watchlists.map((list) => list.id === watchlistId && !list.symbols.includes(symbol) ? { ...list, symbols: [...list.symbols, symbol] } : list)
  })),
  removeSymbolFromWatchlist: (watchlistId, symbol) => set((state) => ({
    watchlists: state.watchlists.map((list) => list.id === watchlistId ? { ...list, symbols: list.symbols.filter((item) => item !== symbol) } : list)
  }))
});
