import { create } from 'zustand';

interface BacktestConfig {
  symbols: string[];
  start_date: string;
  end_date: string;
  initial_capital: number;
  strategy: string;
  short_window: number;
  long_window: number;
}

interface BacktestResult {
  id: string;
  config: BacktestConfig;
  metrics: {
    total_return: number;
    total_return_pct: number;
    total_trades: number;
    winning_trades: number;
    losing_trades: number;
    win_rate: number;
    max_drawdown: number;
    sharpe_ratio: number;
    final_value: number;
  };
  trades: Array<{
    date: string;
    symbol: string;
    side: 'buy' | 'sell';
    price: number;
    qty: number;
    pnl?: number;
  }>;
  equity_curve: Array<{
    date: string;
    value: number;
  }>;
  created_at: string;
}

interface BacktestStore {
  results: BacktestResult[];
  currentResult: BacktestResult | null;
  isRunning: boolean;
  error: string | null;

  runBacktest: (config: BacktestConfig) => Promise<void>;
  fetchResults: () => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBacktestStore = create<BacktestStore>((set) => ({
  results: [],
  currentResult: null,
  isRunning: false,
  error: null,

  runBacktest: async (config: BacktestConfig) => {
    set({ isRunning: true, error: null });
    try {
      const response = await fetch('/api/backtest/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run backtest');
      }

      const result = await response.json();
      set((state) => ({
        results: [result, ...state.results],
        currentResult: result,
        isRunning: false,
      }));
    } catch (error) {
      set({
        error: (error as Error).message,
        isRunning: false,
      });
    }
  },

  fetchResults: async () => {
    try {
      const response = await fetch('/api/backtest/results');
      if (!response.ok) {
        throw new Error('Failed to fetch backtest results');
      }
      const data = await response.json();
      set({ results: data.results || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteResult: async (id: string) => {
    try {
      const response = await fetch(`/api/backtest/results?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete backtest result');
      }

      set((state) => ({
        results: state.results.filter((r) => r.id !== id),
        currentResult: state.currentResult?.id === id ? null : state.currentResult,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  clearError: () => set({ error: null }),
}));
