export type ScreenerStock = {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number;
  pe: number;
  volume: number;
  price: number;
  sparkline: number[];
};

const sectors = ['Technology', 'Finance', 'Energy', 'Healthcare', 'Consumer', 'Industrial'];

export function generateMockStocks(count = 5000): ScreenerStock[] {
  return Array.from({ length: count }).map((_, index) => {
    const price = 10 + Math.random() * 900;
    return {
      symbol: `STK${index + 1}`,
      name: `Company ${index + 1}`,
      sector: sectors[index % sectors.length],
      marketCap: Math.round(Math.random() * 2_000_000_000_000),
      pe: Number((5 + Math.random() * 70).toFixed(2)),
      volume: Math.round(Math.random() * 50_000_000),
      price,
      sparkline: Array.from({ length: 24 }).map(() => price + (Math.random() - 0.5) * 10)
    };
  });
}
