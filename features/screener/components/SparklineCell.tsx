'use client';

import { memo, useMemo } from 'react';

export const SparklineCell = memo(function SparklineCell({ values }: { values: number[] }) {
  const path = useMemo(() => {
    if (!values.length) return '';
    const width = 96;
    const height = 28;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values.map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  }, [values]);

  return <svg width="96" height="28" viewBox="0 0 96 28"><path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400" /></svg>;
});
