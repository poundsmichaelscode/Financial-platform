# Financial Platform

A high-performance, real-time financial dashboard built with **Next.js 14**, **TypeScript**, **Zustand**, **TradingView Lightweight Charts**, **D3.js**, **TanStack Virtual**, **Web Workers**, and **WebSockets**.

The platform is designed to feel like a modern trading terminal, combining real-time market data, advanced charting, portfolio analytics, virtualized stock screening, watchlists, news sentiment, and performance-focused frontend engineering.

---

## Live Demo

**Live Application:**  
https://financial-platform-orpin.vercel.app/

---

## Project Overview

Financial Platform is a production-grade frontend application for monitoring financial markets in real time.

It demonstrates how to build a scalable, performance-focused trading dashboard capable of handling frequent price updates, large datasets, heavy calculations, and complex UI interactions without blocking the main browser thread.

The application is built with a clean feature-based architecture and optimized for speed, responsiveness, and maintainability.

---

## Key Features

### Real-Time Market Data

- WebSocket-based market data engine
- Subscribe and unsubscribe to symbols
- Auto-reconnect support
- Normalized incoming tick data
- Zustand-powered real-time price store
- Mock market stream support for development
- Optimized selectors to prevent unnecessary re-renders

### Advanced Charting

- TradingView Lightweight Charts integration
- Candlestick chart rendering
- Volume bars
- Timeframe switching
- Crosshair tooltip with OHLCV values
- Efficient real-time chart updates
- Candle history limits for memory control

### Technical Indicators With Web Workers

Heavy calculations are moved off the main thread using native Web Workers.

Supported indicators include:

- SMA
- EMA
- RSI
- MACD
- Bollinger Bands

This keeps the UI smooth even while processing financial calculations.

### Portfolio Analytics

- Portfolio holdings management
- Real-time market value calculation
- Profit and loss tracking
- Allocation visualization
- D3.js-powered charting
- Optimized portfolio metrics

### Stock Screener

- Handles thousands of instruments
- Virtualized rendering with TanStack Virtual
- Sorting and filtering
- Sticky table headers
- Inline sparkline charts
- Designed for smooth scrolling and high performance

### Watchlist

- Multiple watchlist support
- Drag-and-drop symbol ordering
- Real-time price updates
- Active symbol switching
- dnd-kit integration

### News and Sentiment

- Symbol-based news structure
- Basic sentiment scoring
- Positive, negative, and neutral classification
- Ready for real API integration

### Performance Monitoring

- Web Vitals integration
- Sentry-ready configuration
- API route for metric collection
- Frontend error capture utility

### Dashboard Layout

- Trading-dashboard-style layout
- Persistent layout support using localStorage
- Modular dashboard panels
- Responsive and scalable UI structure

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Charts | TradingView Lightweight Charts |
| Data Visualization | D3.js |
| Large Lists | TanStack Virtual |
| Drag and Drop | dnd-kit |
| Background Processing | Native Web Workers |
| Real-Time Updates | WebSockets |
| Monitoring | Sentry, Web Vitals |
| Deployment | Vercel |

---

## Project Structure

```txt
app/
  api/
    market/
      history/
        route.ts
    metrics/
      route.ts
    news/
      route.ts
  layout.tsx
  page.tsx
  globals.css

components/
  dashboard/
    DashboardClient.tsx
  layout/
    ResizableDashboard.tsx
  shared/

features/
  charts/
    components/
      TradingChart.tsx
      ChartToolbar.tsx
      CrosshairTooltip.tsx
    hooks/
      useIndicatorWorker.ts
    types.ts

  portfolio/
    components/
      PortfolioTable.tsx
      AllocationPieChart.tsx
      PerformanceChart.tsx
    hooks/
      usePortfolioMetrics.ts

  screener/
    components/
      ScreenerTable.tsx
      ScreenerFilters.tsx
      SparklineCell.tsx
    hooks/
      useScreenerFilter.ts
    utils/
      generateMockStocks.ts

  ticker/
    components/
      RealtimeTicker.tsx
      TickerItem.tsx

  watchlist/
    components/
      DraggableWatchlist.tsx
      WatchlistRow.tsx
      WatchlistTabs.tsx

  news/
    components/
      NewsPanel.tsx
    lib/
      sentiment.ts

hooks/
  useRealtimePrices.ts
  useLocalStorageLayout.ts

lib/
  api/
    market.ts
    news.ts
  ws/
    WebSocketManager.ts
    normalizers.ts
  monitoring/
    sentry.ts
    webVitals.ts
  constants.ts

store/
  index.ts
  priceSlice.ts
  portfolioSlice.ts
  uiSlice.ts
  watchlistSlice.ts

workers/
  indicator.worker.ts


---

## Architecture

The application uses a **feature-based architecture**. Each major business domain owns its components, hooks, utilities, and types.

This makes the project easier to scale as more financial features are added.

Examples:

```txt
features/charts
features/portfolio
features/screener
features/watchlist
features/news
```

Global application state is handled with Zustand slices:

```txt
priceSlice
portfolioSlice
uiSlice
watchlistSlice
```

This keeps state modular, predictable, and easy to maintain.

---

## Performance Engineering

This project was built with performance as a core requirement.

### 1. WebSocket Data Normalization

Incoming real-time data is normalized into a consistent internal format:

```ts
type Tick = {
  symbol: string;
  price: number;
  change?: number;
  volume?: number;
  timestamp: number;
};
```

This allows the UI to stay independent of the market data provider.

---

### 2. Zustand Selectors

Components subscribe only to the specific state they need:

```ts
const price = useAppStore((state) => state.prices.get(symbol));
```

This prevents unnecessary re-renders across the dashboard.

---

### 3. Imperative Chart Updates

The TradingView chart is updated using:

```ts
series.update(latestCandle);
```

Instead of re-rendering the entire chart through React, the chart updates imperatively for better real-time performance.

---

### 4. Web Workers for Heavy Calculations

Technical indicators are calculated in a Web Worker:

```txt
workers/indicator.worker.ts
```

This prevents SMA, EMA, RSI, MACD, and Bollinger Band calculations from blocking the main UI thread.

---

### 5. Virtualized Tables

The screener and portfolio tables use TanStack Virtual so only visible rows are rendered.

This allows the application to handle thousands of rows smoothly.

---

### 6. Memory Control

Candle history is capped to avoid unbounded memory growth during long-running sessions.

```ts
MAX_CANDLE_HISTORY = 2000;
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js 20 LTS
* npm
* Git

Check versions:

```bash
node -v
npm -v
git --version
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/poundsmichaelscode/Financial-platform.git
cd Financial-platform
```

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_FINNHUB_API_KEY=
NEXT_PUBLIC_SENTRY_DSN=
```

The application can run with mock/demo data if a live market data key is not provided.

---

## Available Scripts

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Run Linting

```bash
npm run lint
```

### Run Type Checking

```bash
npm run typecheck
```

---

## Deployment

The project is deployed on **Vercel**.

### Production URL

```txt
https://financial-platform-orpin.vercel.app/
```

### Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Select **Next.js** as the framework.
4. Set the root directory to:

```txt
./
```

5. Add environment variables if needed.
6. Deploy.

---

## Production Notes

For production usage, avoid exposing private market data provider keys directly in the browser.

Recommended architecture:

```txt
Browser
  ↓
Next.js API Route / Backend Gateway
  ↓
Market Data Provider
```

For real-time streaming:

```txt
Browser
  ↓
Backend WebSocket Gateway
  ↓
Finnhub / Binance / Polygon / Alpaca
```

This protects API keys and allows better control over:

* Rate limiting
* Authentication
* Usage tracking
* Symbol permissions
* Paid plan access
* Data normalization
* Caching

---

## Common Issues and Fixes

### SWC Binary Error on macOS

If you see:

```txt
Failed to load SWC binary for darwin/x64
```

Run:

```bash
rm -rf node_modules package-lock.json .next
npm cache clean --force
npm install
npm run dev
```

If you are using a very new Node version, switch to Node 20:

```bash
nvm install 20
nvm use 20
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

---

### Broken Dashboard Route Import

If you see:

```txt
Module not found: Can't resolve './(dashboard)/page'
```

Make sure `app/page.tsx` directly renders the dashboard client:

```tsx
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export default function HomePage() {
  return <DashboardClient />;
}
```

Do not import from:

```txt
./(dashboard)/page
```

---

### Vercel Manifest Error

If Vercel shows:

```txt
ENOENT: no such file or directory, lstat '.next/server/app/(dashboard)/page_client-reference-manifest.js'
```

Remove the stale route group:

```bash
rm -rf "app/(dashboard)"
```

Then confirm:

```bash
find app -path "*\(dashboard\)*"
```

Commit and redeploy without build cache.

---

## Engineering Highlights

This project demonstrates:

* Advanced frontend architecture
* Real-time data streaming
* High-frequency UI updates
* WebSocket lifecycle management
* Zustand slice architecture
* Web Worker computation
* TradingView chart integration
* Large table virtualization
* D3 chart rendering
* Dashboard layout persistence
* Performance monitoring
* Production deployment with Vercel

---

## Roadmap

### Phase 1

* Real-time ticker
* TradingView chart
* Portfolio table
* Screener table
* Watchlist
* Web Worker indicators

### Phase 2

* Real market data provider integration
* Authenticated user accounts
* Persistent watchlists
* Persistent portfolios
* Saved dashboard layouts

### Phase 3

* Backend WebSocket gateway
* Redis-powered market stream cache
* Advanced alerts
* Price notifications
* User-defined indicators

### Phase 4

* AI market summaries
* News intelligence
* Strategy backtesting
* Subscription billing
* Admin dashboard

---

## Author

Built by **poundsmichaels digitals**

GitHub: [https://github.com/poundsmichaelscode](https://github.com/poundsmichaelscode)

Live Demo: [https://financial-platform-orpin.vercel.app/](https://financial-platform-orpin.vercel.app/)

---

## License

This project is available for portfolio, educational, and commercial extension purposes.

Before using it in production, review the licensing requirements of all third-party APIs, charting libraries, and market data providers.

---

## Summary

Financial Platform is a modern, scalable, and performance-focused financial dashboard built with a production-grade frontend architecture.

It combines real-time streaming, advanced charts, virtualized data tables, Web Worker calculations, portfolio analytics, watchlists, news sentiment, and monitoring into a single professional trading dashboard experience.

```
```
