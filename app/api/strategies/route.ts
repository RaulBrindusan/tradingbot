import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STRATEGIES_FILE = path.join(process.cwd(), 'bot/data/strategies.json');

export async function GET() {
  try {
    // Check if strategies file exists
    if (!fs.existsSync(STRATEGIES_FILE)) {
      return NextResponse.json(
        { error: 'Strategies catalog not found. Run: python3 bot/src/utils/export_strategies.py' },
        { status: 404 }
      );
    }

    // Read strategies file
    const data = fs.readFileSync(STRATEGIES_FILE, 'utf-8');
    const strategies = JSON.parse(data);

    return NextResponse.json(strategies);
  } catch (error) {
    console.error('Error reading strategies:', error);
    return NextResponse.json(
      { error: 'Failed to read strategies catalog' },
      { status: 500 }
    );
  }
}
