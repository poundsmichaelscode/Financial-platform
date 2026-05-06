'use client';

import { memo, useMemo } from 'react';

export const PerformanceChart = memo(function PerformanceChart() {
  const path = useMemo(() => {
    const values = Array.from({ length: 64 }).map((_, index) => 100 + Math.sin(index / 5) * 8 + index * 0.28 + Math.cos(index / 11) * 6);
    const width = 440;
    const height = 120;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return values.map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / (max - min || 1)) * height;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  }, []);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-slate-950 p-4">
      <h2 className="mb-3 text-sm font-semibold text-white">Performance vs Benchmark</h2>
      <svg viewBox="0 0 440 120" className="h-28 w-full text-emerald-400">
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </section>
  );
});
