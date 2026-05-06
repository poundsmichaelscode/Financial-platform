'use client';

import { memo } from 'react';
import type { IndicatorResult } from '../types';

export const IndicatorBadge = memo(function IndicatorBadge({ indicators }: { indicators: IndicatorResult }) {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/75 px-3 py-2 text-xs text-zinc-400 shadow-lg">
      Worker indicators: {Object.keys(indicators).length || 0} active
    </div>
  );
});
