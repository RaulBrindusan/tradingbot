import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTROL_FILE = path.join(process.cwd(), 'bot/data/bot_control.json');

// Check if running in serverless environment (Vercel)
const isServerless = process.env.VERCEL === '1' || !fs.existsSync(path.join(process.cwd(), 'bot'));

export async function GET() {
  try {
    // If in serverless environment, return default state
    if (isServerless) {
      const defaultState = {
        status: 'stopped',
        mode: 'paper',
        last_updated: new Date().toISOString(),
        error: 'Bot can only run in local development environment',
        symbols: ['AAPL', 'MSFT', 'GOOGL', 'TSLA'],
        isServerless: true
      };
      return NextResponse.json(defaultState);
    }

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

      // Ensure directory exists
      const dataDir = path.dirname(CONTROL_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(CONTROL_FILE, JSON.stringify(defaultState, null, 2));
      return NextResponse.json(defaultState);
    }

    // Read control file
    const data = fs.readFileSync(CONTROL_FILE, 'utf-8');
    const controlState = JSON.parse(data);

    return NextResponse.json(controlState);
  } catch (error) {
    console.error('Error reading bot status:', error);
    // Return a safe default state instead of error
    return NextResponse.json({
      status: 'stopped',
      mode: 'paper',
      last_updated: new Date().toISOString(),
      error: 'Failed to read bot status',
      symbols: ['AAPL', 'MSFT', 'GOOGL', 'TSLA']
    });
  }
}
