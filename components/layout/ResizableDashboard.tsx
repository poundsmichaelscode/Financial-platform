'use client';

import type { ReactNode } from 'react';
import { useLocalStorageLayout } from '@/hooks/useLocalStorageLayout';

export function ResizableDashboard({ left, center, right, bottom }: { left: ReactNode; center: ReactNode; right: ReactNode; bottom: ReactNode }) {
  const [layout] = useLocalStorageLayout('terminal-layout', { left: 290, right: 390, bottom: 365 });

  return (
    <main className="grid h-[calc(100vh-40px)] gap-3 bg-black p-3" style={{ gridTemplateColumns: `${layout.left}px minmax(0,1fr) ${layout.right}px`, gridTemplateRows: `minmax(0,1fr) ${layout.bottom}px` }}>
      <aside className="min-h-0 overflow-hidden">{left}</aside>
      <section className="min-h-0 overflow-hidden">{center}</section>
      <aside className="min-h-0 overflow-auto">{right}</aside>
      <section className="col-span-3 min-h-0 overflow-hidden">{bottom}</section>
    </main>
  );
}
