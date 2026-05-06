'use client';

import { memo, useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { fetchSymbolNews, type NewsItem } from '@/lib/api/news';
import { scoreSentiment } from '../lib/sentiment';

export const NewsPanel = memo(function NewsPanel() {
  const symbol = useAppStore((state) => state.activeSymbol);
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchSymbolNews(symbol).then((news) => {
      if (!cancelled) setItems(news);
    }).catch(console.error);
    return () => { cancelled = true; };
  }, [symbol]);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-slate-950">
      <div className="border-b border-zinc-800 p-4"><h2 className="text-sm font-semibold text-white">News Sentiment</h2><p className="text-xs text-zinc-500">{symbol}</p></div>
      <div className="max-h-[280px] divide-y divide-zinc-900 overflow-auto">
        {items.map((item) => {
          const sentiment = scoreSentiment(`${item.headline} ${item.summary}`);
          return (
            <article key={item.id} className="p-4">
              <div className="mb-1 flex items-center justify-between gap-3"><h3 className="text-sm font-medium text-white">{item.headline}</h3><span className={sentiment === 'positive' ? 'rounded bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400' : sentiment === 'negative' ? 'rounded bg-red-500/10 px-2 py-1 text-xs text-red-400' : 'rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400'}>{sentiment}</span></div>
              <p className="text-xs text-zinc-500">{item.source}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
});
