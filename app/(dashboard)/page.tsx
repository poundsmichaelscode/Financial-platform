import dynamic from 'next/dynamic';
import { RealtimeTicker } from '@/features/ticker/components/RealtimeTicker';
import { DraggableWatchlist } from '@/features/watchlist/components/DraggableWatchlist';
import { PortfolioTable } from '@/features/portfolio/components/PortfolioTable';
import { AllocationPieChart } from '@/features/portfolio/components/AllocationPieChart';
import { PerformanceChart } from '@/features/portfolio/components/PerformanceChart';
import { ScreenerTable } from '@/features/screener/components/ScreenerTable';
import { NewsPanel } from '@/features/news/components/NewsPanel';
import { ResizableDashboard } from '@/components/layout/ResizableDashboard';

const TradingChart = dynamic(() => import('@/features/charts/components/TradingChart').then((module) => module.TradingChart), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center rounded-2xl border border-zinc-800 bg-slate-950 text-sm text-zinc-500">Loading chart engine...</div>
});

export default function DashboardPage() {
  return (
    <div className="h-screen overflow-hidden bg-black">
      <RealtimeTicker />
      <ResizableDashboard
        left={<DraggableWatchlist />}
        center={<TradingChart />}
        right={<div className="grid gap-3"><PortfolioTable /><AllocationPieChart /><PerformanceChart /><NewsPanel /></div>}
        bottom={<ScreenerTable />}
      />
    </div>
  );
}
