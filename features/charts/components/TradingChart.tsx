'use client';

import { memo, useEffect, useRef, useState } from 'react';
import {
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  createChart,
  type CandlestickData,
  type HistogramData,
  type IChartApi,
  type ISeriesApi,
  type LineData
} from 'lightweight-charts';
import { useAppStore } from '@/store';
import { fetchHistoricalCandles } from '@/lib/api/market';
import { MAX_CANDLE_HISTORY } from '@/lib/constants';
import type { Candle } from '../types';
import { ChartToolbar } from './ChartToolbar';
import { CrosshairTooltip } from './CrosshairTooltip';
import { IndicatorBadge } from './IndicatorBadge';
import { useIndicatorWorker } from '../hooks/useIndicatorWorker';

type TooltipState = {
  x: number;
  y: number;
  candle: { open: number; high: number; low: number; close: number };
  volume?: { value?: number };
};

export const TradingChart = memo(function TradingChart() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const symbol = useAppStore((state) => state.activeSymbol);
  const timeframe = useAppStore((state) => state.timeframe);
  const latestTick = useAppStore((state) => state.prices.get(symbol));

  const indicators = useIndicatorWorker(candles, { sma: 20, ema: 50, rsi: 14, macd: true, bollinger: true });

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: { background: { color: '#020617' }, textColor: '#cbd5e1' },
      grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
      rightPriceScale: { borderColor: '#334155' },
      timeScale: { borderColor: '#334155' },
      crosshair: { mode: 1 }
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444'
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: ''
    });

    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

    const smaSeries = chart.addSeries(LineSeries, { color: '#facc15', lineWidth: 1 });
    const emaSeries = chart.addSeries(LineSeries, { color: '#60a5fa', lineWidth: 1 });

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        setTooltip(null);
        return;
      }
      const candle = param.seriesData.get(candleSeries) as CandlestickData | undefined;
      const volume = param.seriesData.get(volumeSeries) as HistogramData | undefined;
      if (!candle) {
        setTooltip(null);
        return;
      }
      setTooltip({ x: param.point.x, y: param.point.y, candle: candle as TooltipState['candle'], volume });
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    smaSeriesRef.current = smaSeries;
    emaSeriesRef.current = emaSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      smaSeriesRef.current = null;
      emaSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const historical = await fetchHistoricalCandles(symbol, timeframe);
      if (cancelled) return;
      setCandles(historical);
      candleSeriesRef.current?.setData(historical.map((item) => ({ time: item.time as any, open: item.open, high: item.high, low: item.low, close: item.close })));
      volumeSeriesRef.current?.setData(historical.map((item) => ({ time: item.time as any, value: item.volume, color: item.close >= item.open ? '#22c55e55' : '#ef444455' })));
      chartRef.current?.timeScale().fitContent();
    }
    load().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [symbol, timeframe]);

  useEffect(() => {
    if (indicators.sma) smaSeriesRef.current?.setData(indicators.sma as LineData[]);
    if (indicators.ema) emaSeriesRef.current?.setData(indicators.ema as LineData[]);
  }, [indicators]);

  useEffect(() => {
    if (!latestTick || candles.length === 0) return;
    const last = candles[candles.length - 1];
    const updated: Candle = {
      ...last,
      high: Math.max(last.high, latestTick.price),
      low: Math.min(last.low, latestTick.price),
      close: latestTick.price,
      volume: last.volume + (latestTick.volume ?? 0)
    };

    candleSeriesRef.current?.update({ time: updated.time as any, open: updated.open, high: updated.high, low: updated.low, close: updated.close });
    volumeSeriesRef.current?.update({ time: updated.time as any, value: updated.volume, color: updated.close >= updated.open ? '#22c55e55' : '#ef444455' });

    setCandles((previous) => {
      const next = previous.slice(0, -1).concat(updated);
      return next.length > MAX_CANDLE_HISTORY ? next.slice(-MAX_CANDLE_HISTORY) : next;
    });
  }, [latestTick]);

  return (
    <section className="relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-slate-950">
      <ChartToolbar />
      <div ref={containerRef} className="relative h-full flex-1" />
      {tooltip && <CrosshairTooltip tooltip={tooltip} />}
      <IndicatorBadge indicators={indicators} />
    </section>
  );
});
