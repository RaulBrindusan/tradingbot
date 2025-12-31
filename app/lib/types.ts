// Trading Types

export interface Trade {
  id: string;
  timestamp: string;
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  price: number;
  order_type: 'market' | 'limit';
  status: 'filled' | 'pending' | 'cancelled' | 'rejected';
  strategy: string;
  pnl?: number;
}

export interface Position {
  symbol: string;
  qty: number;
  avg_entry_price: number;
  market_value: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  current_price: number;
}

export interface Account {
  cash: number;
  portfolio_value: number;
  buying_power: number;
  equity: number;
  last_equity: number;
}

export interface PerformanceMetrics {
  total_pnl?: number;
  total_pnl_pct?: number;
  win_rate?: number;
  total_trades?: number;
  winning_trades?: number;
  losing_trades?: number;
  sharpe_ratio?: number;
  max_drawdown?: number;
  avg_win?: number;
  avg_loss?: number;
}

export interface DailyPnL {
  date: string;
  pnl: number;
}

export interface Performance {
  metrics: PerformanceMetrics;
  daily_pnl: DailyPnL[];
  updated_at?: string;
}

export interface TradesData {
  trades: Trade[];
}

export interface PositionsData {
  positions: Position[];
  account?: Account;
  updated_at?: string;
}

// Market Data Types

export interface Quote {
  symbol: string;
  ask_price: number;
  bid_price: number;
  ask_size: number;
  bid_size: number;
  timestamp: string;
}

export interface Bar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketClock {
  is_open: boolean;
  next_open: string;
  next_close: string;
  timestamp: string;
}

// Strategy Types

export interface StrategyConfig {
  name: string;
  enabled: boolean;
  parameters: Record<string, any>;
}

export interface StrategyCardData {
  name: string;
  status: 'active' | 'paused' | 'stopped';
  pnl: number;
  pnl_pct: number;
  win_rate: number;
  total_trades: number;
}

// API Response Types

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
