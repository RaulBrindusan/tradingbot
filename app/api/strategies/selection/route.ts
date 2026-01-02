import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SELECTION_FILE = path.join(process.cwd(), 'bot/data/strategy_selection.json');

// GET: Load selected strategies
export async function GET() {
  try {
    // Check if selection file exists
    if (!fs.existsSync(SELECTION_FILE)) {
      // Return empty selection if file doesn't exist
      return NextResponse.json({
        selected_strategies: {},
        last_updated: new Date().toISOString()
      });
    }

    // Read selection file
    const data = fs.readFileSync(SELECTION_FILE, 'utf-8');
    const selection = JSON.parse(data);

    return NextResponse.json(selection);
  } catch (error) {
    console.error('Error reading strategy selection:', error);
    return NextResponse.json(
      { error: 'Failed to read strategy selection' },
      { status: 500 }
    );
  }
}

// POST: Save selected strategies
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selected_strategies } = body;

    if (!selected_strategies || typeof selected_strategies !== 'object') {
      return NextResponse.json(
        { error: 'Invalid strategy selection format' },
        { status: 400 }
      );
    }

    // Create data directory if it doesn't exist
    const dataDir = path.dirname(SELECTION_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save selection to file
    const selectionData = {
      selected_strategies,
      last_updated: new Date().toISOString()
    };

    fs.writeFileSync(SELECTION_FILE, JSON.stringify(selectionData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Strategy selection saved successfully',
      ...selectionData
    });
  } catch (error) {
    console.error('Error saving strategy selection:', error);
    return NextResponse.json(
      { error: 'Failed to save strategy selection' },
      { status: 500 }
    );
  }
}
