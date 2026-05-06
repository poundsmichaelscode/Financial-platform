import { NextResponse } from 'next/server';

const headlines = [
  'Analysts see strong institutional demand as market volume expands',
  'Earnings outlook improves after record quarterly revenue',
  'Macro uncertainty weighs on risk assets after weak guidance',
  'New product cycle could support growth into next quarter',
  'Regulatory pressure creates short-term volatility across the sector'
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') ?? 'BTC';

  return NextResponse.json(
    headlines.map((headline, index) => ({
      id: `${symbol}-${index}`,
      headline,
      source: ['MarketWire', 'FinDesk', 'ExchangeFeed'][index % 3],
      url: '#',
      datetime: Date.now() - index * 3600000,
      summary: `${symbol} update: ${headline.toLowerCase()}.`
    }))
  );
}
