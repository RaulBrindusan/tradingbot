import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTROL_FILE = path.join(process.cwd(), 'bot/data/bot_control.json');

// Check if running in serverless environment (Vercel)
const isServerless = process.env.VERCEL === '1' || !fs.existsSync(path.join(process.cwd(), 'bot'));

interface ControlRequest {
  action: 'start' | 'pause' | 'stop';
}

interface BotControlState {
  status: 'running' | 'paused' | 'stopped';
  mode: 'paper' | 'live';
  last_updated: string;
  error: string | null;
}

export async function POST(request: Request) {
  try {
    const body: ControlRequest = await request.json();
    const { action } = body;

    if (!['start', 'pause', 'stop'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be start, pause, or stop' },
        { status: 400 }
      );
    }

    // If in serverless environment, return error
    if (isServerless) {
      return NextResponse.json(
        { error: 'Bot control is only available in local development environment. The bot runs on your local machine, not on Vercel.' },
        { status: 400 }
      );
    }

    // Read current state
    let currentState: BotControlState;
    if (fs.existsSync(CONTROL_FILE)) {
      const data = fs.readFileSync(CONTROL_FILE, 'utf-8');
      currentState = JSON.parse(data);
    } else {
      currentState = {
        status: 'stopped',
        mode: 'paper',
        last_updated: new Date().toISOString(),
        error: null
      };
    }

    // Update status based on action
    const newState: BotControlState = {
      ...currentState,
      status: action === 'start' ? 'running' : action === 'pause' ? 'paused' : 'stopped',
      last_updated: new Date().toISOString(),
      error: null
    };

    // Ensure directory exists
    const dataDir = path.dirname(CONTROL_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write updated state
    fs.writeFileSync(CONTROL_FILE, JSON.stringify(newState, null, 2));

    return NextResponse.json({
      success: true,
      state: newState,
      message: `Bot ${action === 'start' ? 'started' : action === 'pause' ? 'paused' : 'stopped'} successfully`
    });
  } catch (error) {
    console.error('Error controlling bot:', error);
    return NextResponse.json(
      { error: 'Failed to control bot' },
      { status: 500 }
    );
  }
}
