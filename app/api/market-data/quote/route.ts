import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Alpaca API endpoint for latest quote
    const alpacaUrl = `https://data.alpaca.markets/v2/stocks/${symbol}/quotes/latest`;

    const response = await fetch(alpacaUrl, {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY || '',
        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY || '',
      },
      next: { revalidate: 1 } // Cache for 1 second
    });

    if (!response.ok) {
      throw new Error(`Alpaca API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      quote: {
        symbol,
        ask_price: data.quote.ap,
        bid_price: data.quote.bp,
        ask_size: data.quote.as,
        bid_size: data.quote.bs,
        timestamp: data.quote.t,
      }
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}

// Enable route handler to be dynamic (no caching in dev)
export const dynamic = 'force-dynamic';
