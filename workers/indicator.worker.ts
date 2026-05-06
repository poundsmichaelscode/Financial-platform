type Candle = { time: number; close: number };
type Point = { time: number; value: number };

type IndicatorPayload = {
  candles: Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }>;
  indicators: { sma?: number; ema?: number; rsi?: number; macd?: boolean; bollinger?: boolean };
};

function sma(values: number[], period: number) {
  const result: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    result.push(i >= period - 1 ? sum / period : Number.NaN);
  }
  return result;
}

function ema(values: number[], period: number) {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  let previous = values[0] ?? 0;
  for (let i = 0; i < values.length; i++) {
    const current = i === 0 ? values[i] : values[i] * multiplier + previous * (1 - multiplier);
    result.push(current);
    previous = current;
  }
  return result;
}

function rsi(values: number[], period: number) {
  const output: number[] = Array(values.length).fill(Number.NaN);
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period && i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    output[i] = 100 - 100 / (1 + rs);
  }

  return output;
}

function bollinger(values: number[], period: number, multiplier = 2) {
  const middle = sma(values, period);
  const upper: number[] = [];
  const lower: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      upper.push(Number.NaN);
      lower.push(Number.NaN);
      continue;
    }
    const start = i - period + 1;
    let variance = 0;
    for (let j = start; j <= i; j++) variance += Math.pow(values[j] - middle[i], 2);
    const std = Math.sqrt(variance / period);
    upper.push(middle[i] + multiplier * std);
    lower.push(middle[i] - multiplier * std);
  }
  return { upper, middle, lower };
}

function macd(values: number[]) {
  const ema12 = ema(values, 12);
  const ema26 = ema(values, 26);
  const macdLine = values.map((_, i) => ema12[i] - ema26[i]);
  const signalLine = ema(macdLine, 9);
  const histogram = macdLine.map((value, i) => value - signalLine[i]);
  return { macdLine, signalLine, histogram };
}

function toSeries(candles: Candle[], values: number[]): Point[] {
  return values
    .map((value, index) => ({ time: candles[index].time, value }))
    .filter((point) => Number.isFinite(point.value));
}

self.onmessage = (event: MessageEvent<IndicatorPayload>) => {
  const { candles, indicators } = event.data;
  const closes = candles.map((item) => item.close);
  const result: Record<string, unknown> = {};

  if (indicators.sma) result.sma = toSeries(candles, sma(closes, indicators.sma));
  if (indicators.ema) result.ema = toSeries(candles, ema(closes, indicators.ema));
  if (indicators.rsi) result.rsi = toSeries(candles, rsi(closes, indicators.rsi));

  if (indicators.bollinger) {
    const bands = bollinger(closes, 20);
    result.bollinger = {
      upper: toSeries(candles, bands.upper),
      middle: toSeries(candles, bands.middle),
      lower: toSeries(candles, bands.lower)
    };
  }

  if (indicators.macd) {
    const data = macd(closes);
    result.macd = {
      macd: toSeries(candles, data.macdLine),
      signal: toSeries(candles, data.signalLine),
      histogram: toSeries(candles, data.histogram)
    };
  }

  self.postMessage(result);
};

export {};
