import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'bot', 'data', 'performance.json');

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ metrics: {}, daily_pnl: [] });
    }

    // Read file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading performance:', error);
    return NextResponse.json(
      { error: 'Failed to read performance', metrics: {}, daily_pnl: [] },
      { status: 500 }
    );
  }
}

// Enable route handler to be dynamic (no caching)
export const dynamic = 'force-dynamic';
