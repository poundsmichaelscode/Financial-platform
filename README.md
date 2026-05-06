# High-Performance Financial Data Platform

A production-style Bloomberg/TradingView-level frontend built with **Next.js 14 App Router**, **TypeScript**, **Zustand slices**, **TradingView Lightweight Charts**, **D3**, **TanStack Virtual**, **native Web Workers**, **WebSockets**, **Sentry**, and **Web Vitals**.

## Features

- Real-time WebSocket data manager with reconnect, subscribe, unsubscribe, and normalized ticks
- Mock data fallback when no Finnhub API key is supplied
- Zustand store with separated slices: prices, portfolio, UI, watchlists
- Imperative TradingView chart updates using `series.update()`
- Candlestick + volume pane
- Worker-based SMA, EMA, RSI, MACD, and Bollinger calculations
- Virtualized portfolio table and 5,000-row stock screener
- D3 allocation pie chart
- Performance chart
- Draggable watchlist with dnd-kit
- News panel with basic sentiment scoring
- Web Vitals route and Sentry config
- Layout persisted to localStorage

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Environment Variables

```env
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

The app runs without a Finnhub key using the included mock real-time market stream.

## Production Build

```bash
npm run typecheck
npm run build
npm run start
```

## Performance Design

- Prices use `Map<symbol, Tick>` for constant-time lookup.
- Components use Zustand selectors to avoid whole-store subscriptions.
- Charts update imperatively instead of re-rendering through React.
- Indicator calculations run inside `/workers/indicator.worker.ts`.
- Tables use TanStack Virtual to render only visible rows.
- Candle history is capped by `MAX_CANDLE_HISTORY`.
- Chart libraries are dynamically imported with `ssr: false`.

## Important Production Note

For paid/secret market-data providers, do not expose keys in the browser. Use a backend WebSocket gateway or Next.js API proxy.
