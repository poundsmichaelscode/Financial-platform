'use client';

import { memo, useMemo } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppStore } from '@/store';
import { WatchlistTabs } from './WatchlistTabs';
import { WatchlistRow } from './WatchlistRow';

export const DraggableWatchlist = memo(function DraggableWatchlist() {
  const watchlists = useAppStore((state) => state.watchlists);
  const activeWatchlistId = useAppStore((state) => state.activeWatchlistId);
  const reorderSymbols = useAppStore((state) => state.reorderSymbols);
  const activeWatchlist = useMemo(() => watchlists.find((item) => item.id === activeWatchlistId), [watchlists, activeWatchlistId]);
  if (!activeWatchlist) return null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = activeWatchlist!.symbols.indexOf(String(active.id));
    const newIndex = activeWatchlist!.symbols.indexOf(String(over.id));
    reorderSymbols(activeWatchlist!.id, arrayMove(activeWatchlist!.symbols, oldIndex, newIndex));
  }

  return (
    <section className="h-full overflow-hidden rounded-2xl border border-zinc-800 bg-slate-950">
      <div className="border-b border-zinc-800 p-4"><h2 className="text-sm font-semibold text-white">Watchlist</h2><p className="text-xs text-zinc-500">Drag to reorder, click to chart</p></div>
      <WatchlistTabs />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={activeWatchlist.symbols} strategy={verticalListSortingStrategy}>
          <div className="divide-y divide-zinc-900">{activeWatchlist.symbols.map((symbol) => <WatchlistRow key={symbol} symbol={symbol} />)}</div>
        </SortableContext>
      </DndContext>
    </section>
  );
});
