import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const BACKTEST_DIR = path.join(process.cwd(), 'bot/data/backtests');
const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY;
const ALPACA_BASE_URL = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets';

// Ensure backtest directory exists
if (!fs.existsSync(BACKTEST_DIR)) {
  fs.mkdirSync(BACKTEST_DIR, { recursive: true });
}

interface BacktestConfig {
  symbols: string[];
  start_date: string;
  end_date: string;
  initial_capital: number;
  strategy: string;
  short_window: number;
  long_window: number;
}

// Simple SMA Crossover backtest logic
async function runBacktest(config: BacktestConfig) {
  const { symbols, start_date, end_date, initial_capital, short_window, long_window } = config;

  let cash = initial_capital;
  let positions: Record<string, { qty: number; avg_price: number }> = {};
  const trades: any[] = [];
  const equity_curve: any[] = [];

  // For simplicity, we'll backtest one symbol at a time
  const symbol = symbols[0];

  // Fetch historical data from Alpaca
  const barsUrl = `${ALPACA_BASE_URL}/v2/stocks/${symbol}/bars?start=${start_date}&end=${end_date}&timeframe=1Day`;

  const response = await fetch(barsUrl, {
    headers: {
      'APCA-API-KEY-ID': ALPACA_API_KEY!,
      'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch historical data from Alpaca');
  }

  const data = await response.json();
  const bars = data.bars || [];

  if (bars.length < long_window) {
    throw new Error(`Not enough data. Need at least ${long_window} days of data.`);
  }

  // Calculate SMAs and generate signals
  for (let i = long_window; i < bars.length; i++) {
    const recentBars = bars.slice(i - long_window, i);

    // Calculate short SMA
    const shortSMA = recentBars
      .slice(-short_window)
      .reduce((sum: number, bar: any) => sum + bar.c, 0) / short_window;

    // Calculate long SMA
    const longSMA = recentBars.reduce((sum: number, bar: any) => sum + bar.c, 0) / long_window;

    const currentBar = bars[i];
    const currentPrice = currentBar.c;
    const date = currentBar.t.split('T')[0];

    // Generate signal
    const hasPosition = symbol in positions;

    // Buy signal: short SMA crosses above long SMA
    if (shortSMA > longSMA && !hasPosition && cash >= currentPrice) {
      const qty = Math.floor(cash / currentPrice);
      if (qty > 0) {
        cash -= qty * currentPrice;
        positions[symbol] = { qty, avg_price: currentPrice };

        trades.push({
          date,
          symbol,
          side: 'buy',
          price: currentPrice,
          qty,
        });
      }
    }

    // Sell signal: short SMA crosses below long SMA
    if (shortSMA < longSMA && hasPosition) {
      const position = positions[symbol];
      const sellValue = position.qty * currentPrice;
      const pnl = sellValue - (position.qty * position.avg_price);

      cash += sellValue;

      trades.push({
        date,
        symbol,
        side: 'sell',
        price: currentPrice,
        qty: position.qty,
        pnl,
      });

      delete positions[symbol];
    }

    // Record equity curve
    let portfolioValue = cash;
    for (const [sym, pos] of Object.entries(positions)) {
      portfolioValue += pos.qty * currentPrice;
    }

    equity_curve.push({
      date,
      value: portfolioValue,
    });
  }

  // Close any remaining positions at end
  if (symbol in positions) {
    const lastBar = bars[bars.length - 1];
    const position = positions[symbol];
    const sellValue = position.qty * lastBar.c;
    const pnl = sellValue - (position.qty * position.avg_price);

    cash += sellValue;

    trades.push({
      date: lastBar.t.split('T')[0],
      symbol,
      side: 'sell',
      price: lastBar.c,
      qty: position.qty,
      pnl,
    });

    delete positions[symbol];
  }

  const finalValue = cash;

  // Calculate metrics
  const totalReturn = finalValue - initial_capital;
  const totalReturnPct = (totalReturn / initial_capital) * 100;

  const winningTrades = trades.filter(t => t.side === 'sell' && (t.pnl || 0) > 0).length;
  const losingTrades = trades.filter(t => t.side === 'sell' && (t.pnl || 0) < 0).length;
  const totalTrades = trades.filter(t => t.side === 'sell').length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  // Calculate max drawdown
  let maxValue = initial_capital;
  let maxDrawdown = 0;
  for (const point of equity_curve) {
    if (point.value > maxValue) {
      maxValue = point.value;
    }
    const drawdown = ((maxValue - point.value) / maxValue) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  // Simple Sharpe ratio calculation (annualized, assuming daily returns)
  const returns = equity_curve.map((point, i) => {
    if (i === 0) return 0;
    return (point.value - equity_curve[i - 1].value) / equity_curve[i - 1].value;
  });
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  );
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

  return {
    metrics: {
      total_return: totalReturn,
      total_return_pct: totalReturnPct,
      total_trades: totalTrades,
      winning_trades: winningTrades,
      losing_trades: losingTrades,
      win_rate: winRate,
      max_drawdown: maxDrawdown,
      sharpe_ratio: sharpeRatio,
      final_value: finalValue,
    },
    trades,
    equity_curve,
  };
}

export async function POST(request: Request) {
  try {
    const config: BacktestConfig = await request.json();

    // Validate config
    if (!config.symbols || config.symbols.length === 0) {
      return NextResponse.json(
        { error: 'At least one symbol is required' },
        { status: 400 }
      );
    }

    if (!config.start_date || !config.end_date) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Run backtest
    const result = await runBacktest(config);

    // Create backtest result object
    const backtestResult = {
      id: uuidv4(),
      config,
      ...result,
      created_at: new Date().toISOString(),
    };

    // Save to file
    const filename = `backtest_${backtestResult.id}.json`;
    const filepath = path.join(BACKTEST_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(backtestResult, null, 2));

    return NextResponse.json(backtestResult);
  } catch (error) {
    console.error('Error running backtest:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to run backtest' },
      { status: 500 }
    );
  }
}
