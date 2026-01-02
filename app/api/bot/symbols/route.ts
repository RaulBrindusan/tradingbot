import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTROL_FILE = path.join(process.cwd(), 'bot/data/bot_control.json');

// Ensure the data directory exists
const dataDir = path.dirname(CONTROL_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const { symbols } = await request.json();

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: 'Symbols must be an array' },
        { status: 400 }
      );
    }

    if (symbols.length === 0) {
      return NextResponse.json(
        { error: 'At least one symbol is required' },
        { status: 400 }
      );
    }

    // Read current control state
    let currentState: any = {
      status: 'stopped',
      mode: 'paper',
      last_updated: new Date().toISOString(),
      error: null,
      symbols: ['AAPL', 'MSFT', 'GOOGL', 'TSLA'],
    };

    if (fs.existsSync(CONTROL_FILE)) {
      const data = fs.readFileSync(CONTROL_FILE, 'utf-8');
      currentState = JSON.parse(data);
    }

    // Update symbols
    const newState = {
      ...currentState,
      symbols,
      last_updated: new Date().toISOString(),
    };

    // Write updated state back to file
    fs.writeFileSync(CONTROL_FILE, JSON.stringify(newState, null, 2));

    return NextResponse.json({
      success: true,
      symbols: newState.symbols,
      last_updated: newState.last_updated,
    });
  } catch (error) {
    console.error('Error updating symbols:', error);
    return NextResponse.json(
      { error: 'Failed to update symbols' },
      { status: 500 }
    );
  }
}
