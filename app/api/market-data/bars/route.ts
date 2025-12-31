import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');
  const timeframe = searchParams.get('timeframe') || '1Min';
  const limit = searchParams.get('limit') || '100';

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Calculate start time (e.g., 5 days ago)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5);
    const start = startDate.toISOString();

    // Alpaca API endpoint for bars
    const alpacaUrl = `https://data.alpaca.markets/v2/stocks/${symbol}/bars?timeframe=${timeframe}&start=${start}&limit=${limit}`;

    const response = await fetch(alpacaUrl, {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY || '',
        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY || '',
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform bars to our format
    const bars = data.bars?.map((bar: any) => ({
      timestamp: bar.t,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
    })) || [];

    return NextResponse.json({ bars });
  } catch (error) {
    console.error('Error fetching bars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bars' },
      { status: 500 }
    );
  }
}

// Enable route handler to be dynamic
export const dynamic = 'force-dynamic';
