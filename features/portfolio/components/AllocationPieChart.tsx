'use client';

import { memo, useMemo } from 'react';
import * as d3 from 'd3';
import { usePortfolioMetrics } from '../hooks/usePortfolioMetrics';

export const AllocationPieChart = memo(function AllocationPieChart() {
  const { rows } = usePortfolioMetrics();
  const width = 280;
  const height = 220;
  const radius = Math.min(width, height) / 2;

  const arcs = useMemo(() => {
    const pie = d3.pie<(typeof rows)[number]>().value((d) => d.marketValue).sort(null);
    const arc = d3.arc<d3.PieArcDatum<(typeof rows)[number]>>().innerRadius(radius * 0.58).outerRadius(radius - 8);
    return pie(rows).map((item, index) => ({ path: arc(item) ?? '', symbol: item.data.symbol, value: item.data.marketValue, color: d3.schemeTableau10[index % d3.schemeTableau10.length] }));
  }, [rows, radius]);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-slate-950 p-4">
      <h2 className="mb-2 text-sm font-semibold text-white">Allocation</h2>
      <div className="flex items-center gap-4">
        <svg width={width} height={height}>
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {arcs.map((item) => <path key={item.symbol} d={item.path} fill={item.color} />)}
          </g>
        </svg>
        <div className="space-y-1">
          {arcs.map((item) => <div key={item.symbol} className="flex min-w-40 justify-between gap-4 text-xs text-zinc-400"><span>{item.symbol}</span><span>${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>)}
        </div>
      </div>
    </section>
  );
});
