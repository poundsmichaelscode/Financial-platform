export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W';

export type Tick = {
  symbol: string;
  price: number;
  change?: number;
  volume?: number;
  timestamp: number;
};

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type IndicatorPayload = {
  candles: Candle[];
  indicators: {
    sma?: number;
    ema?: number;
    rsi?: number;
    macd?: boolean;
    bollinger?: boolean;
  };
};

export type IndicatorResult = {
  sma?: { time: number; value: number }[];
  ema?: { time: number; value: number }[];
  rsi?: { time: number; value: number }[];
  macd?: {
    macd: { time: number; value: number }[];
    signal: { time: number; value: number }[];
    histogram: { time: number; value: number }[];
  };
  bollinger?: {
    upper: { time: number; value: number }[];
    middle: { time: number; value: number }[];
    lower: { time: number; value: number }[];
  };
};
