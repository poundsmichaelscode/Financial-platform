'use client';

import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useAppStore } from '@/store';

export const WatchlistRow = memo(function WatchlistRow({ symbol }: { symbol: string }) {
  const price = useAppStore((state) => state.prices.get(symbol));
  const direction = useAppStore((state) => state.lastDirection.get(symbol));
  const activeSymbol = useAppStore((state) => state.activeSymbol);
  const setActiveSymbol = useAppStore((state) => state.setActiveSymbol);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: symbol });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`flex w-full items-center justify-between px-3 py-3 text-left hover:bg-zinc-900 ${activeSymbol === symbol ? 'bg-zinc-900' : ''}`}>
      <button className="mr-2 cursor-grab text-zinc-600" {...attributes} {...listeners} aria-label="Drag row"><GripVertical size={16} /></button>
      <button onClick={() => setActiveSymbol(symbol)} className="flex flex-1 items-center justify-between text-left">
        <span className="text-sm font-medium text-white">{symbol}</span>
        <span className={direction === 'up' ? 'font-mono text-sm text-emerald-400' : direction === 'down' ? 'font-mono text-sm text-red-400' : 'font-mono text-sm text-zinc-400'}>{price ? price.price.toFixed(2) : '--'}</span>
      </button>
    </div>
  );
});
