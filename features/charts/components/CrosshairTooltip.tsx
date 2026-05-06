'use client';

import { memo } from 'react';

type Tooltip = {
  x: number;
  y: number;
  candle: { open: number; high: number; low: number; close: number };
  volume?: { value?: number };
};

export const CrosshairTooltip = memo(function CrosshairTooltip({ tooltip }: { tooltip: Tooltip }) {
  const candle = tooltip.candle;
  return (
    <div className="pointer-events-none absolute z-20 rounded-lg border border-zinc-700 bg-black/90 px-3 py-2 text-xs text-zinc-200 shadow-xl" style={{ left: tooltip.x + 16, top: tooltip.y + 16 }}>
      <div>O: {candle.open.toFixed(2)}</div>
      <div>H: {candle.high.toFixed(2)}</div>
      <div>L: {candle.low.toFixed(2)}</div>
      <div>C: {candle.close.toFixed(2)}</div>
      <div>V: {tooltip.volume?.value?.toLocaleString() ?? '--'}</div>
    </div>
  );
});
