import { NextResponse } from 'next/server';

const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY;
const ALPACA_BASE_URL = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets';

export async function GET() {
  try {
    // Check if API keys are configured
    if (!ALPACA_API_KEY || !ALPACA_SECRET_KEY) {
      return NextResponse.json({
        is_open: false,
        timestamp: new Date().toISOString(),
        error: 'Alpaca API keys not configured'
      });
    }

    // Fetch clock from Alpaca API
    const response = await fetch(`${ALPACA_BASE_URL}/v2/clock`, {
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch market status from Alpaca');
    }

    const data = await response.json();

    return NextResponse.json({
      is_open: data.is_open,
      next_open: data.next_open,
      next_close: data.next_close,
      timestamp: data.timestamp,
    });
  } catch (error) {
    console.error('Error fetching market status:', error);
    return NextResponse.json(
      {
        is_open: false,
        timestamp: new Date().toISOString(),
        error: 'Failed to fetch market status'
      },
      { status: 500 }
    );
  }
}
