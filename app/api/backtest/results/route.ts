import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BACKTEST_DIR = path.join(process.cwd(), 'bot/data/backtests');

// Ensure backtest directory exists
if (!fs.existsSync(BACKTEST_DIR)) {
  fs.mkdirSync(BACKTEST_DIR, { recursive: true });
}

export async function GET() {
  try {
    const files = fs.readdirSync(BACKTEST_DIR);
    const backtestFiles = files.filter(file => file.startsWith('backtest_') && file.endsWith('.json'));

    const results = backtestFiles.map(file => {
      const filepath = path.join(BACKTEST_DIR, file);
      const data = fs.readFileSync(filepath, 'utf-8');
      return JSON.parse(data);
    });

    // Sort by created_at descending (most recent first)
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching backtest results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backtest results' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Backtest ID is required' },
        { status: 400 }
      );
    }

    const filename = `backtest_${id}.json`;
    const filepath = path.join(BACKTEST_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return NextResponse.json(
        { error: 'Backtest result not found' },
        { status: 404 }
      );
    }

    fs.unlinkSync(filepath);

    return NextResponse.json({ success: true, message: 'Backtest result deleted' });
  } catch (error) {
    console.error('Error deleting backtest result:', error);
    return NextResponse.json(
      { error: 'Failed to delete backtest result' },
      { status: 500 }
    );
  }
}
