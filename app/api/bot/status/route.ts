import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTROL_FILE = path.join(process.cwd(), 'bot/data/bot_control.json');

export async function GET() {
  try {
    // Check if control file exists
    if (!fs.existsSync(CONTROL_FILE)) {
      // Create default control file if it doesn't exist
      const defaultState = {
        status: 'stopped',
        mode: 'paper',
        last_updated: new Date().toISOString(),
        error: null,
        symbols: ['AAPL', 'MSFT', 'GOOGL', 'TSLA']
      };
      fs.writeFileSync(CONTROL_FILE, JSON.stringify(defaultState, null, 2));
      return NextResponse.json(defaultState);
    }

    // Read control file
    const data = fs.readFileSync(CONTROL_FILE, 'utf-8');
    const controlState = JSON.parse(data);

    return NextResponse.json(controlState);
  } catch (error) {
    console.error('Error reading bot status:', error);
    return NextResponse.json(
      { error: 'Failed to read bot status' },
      { status: 500 }
    );
  }
}
