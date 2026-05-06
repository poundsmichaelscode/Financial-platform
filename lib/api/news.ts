export type NewsItem = { id: string; headline: string; source: string; url: string; datetime: number; summary: string };
export async function fetchSymbolNews(symbol: string): Promise<NewsItem[]> {
  const response = await fetch(`/api/news?symbol=${encodeURIComponent(symbol)}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to fetch news');
  return response.json();
}
