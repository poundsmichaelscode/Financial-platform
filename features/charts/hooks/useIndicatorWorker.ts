'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Candle, IndicatorPayload, IndicatorResult } from '../types';

export function useIndicatorWorker(candles: Candle[], indicators: IndicatorPayload['indicators']) {
  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<IndicatorResult>({});

  const stableIndicators = useMemo(() => indicators, [indicators.sma, indicators.ema, indicators.rsi, indicators.macd, indicators.bollinger]);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../../workers/indicator.worker.ts', import.meta.url), { type: 'module' });
    workerRef.current.onmessage = (event: MessageEvent<IndicatorResult>) => setResult(event.data);
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!workerRef.current || candles.length === 0) return;
    workerRef.current.postMessage({ candles, indicators: stableIndicators } satisfies IndicatorPayload);
  }, [candles, stableIndicators]);

  return result;
}
