'use client';

import { memo } from 'react';
import { useAppStore } from '@/store';

export const WatchlistTabs = memo(function WatchlistTabs() {
  const watchlists = useAppStore((state) => state.watchlists);
  const activeWatchlistId = useAppStore((state) => state.activeWatchlistId);
  const setActiveWatchlist = useAppStore((state) => state.setActiveWatchlist);
  return (
    <div className="flex gap-1 border-b border-zinc-800 p-2">
      {watchlists.map((list) => <button key={list.id} onClick={() => setActiveWatchlist(list.id)} className={list.id === activeWatchlistId ? 'rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-black' : 'rounded-md bg-zinc-900 px-3 py-1 text-xs text-zinc-400'}>{list.name}</button>)}
    </div>
  );
});
