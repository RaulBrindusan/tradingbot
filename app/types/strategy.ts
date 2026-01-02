export type StrategyCategory =
  | 'Trend Following'
  | 'Mean Reversion'
  | 'Momentum'
  | 'Volatility'
  | 'Volume'
  | 'Statistical Arbitrage'
  | 'Multi-Indicator'
  | 'Breakout';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Strategy {
  rank: number;
  name: string;
  code: string;
  category: StrategyCategory;
  difficulty: DifficultyLevel;
  description: string;
  timeframes: string[];
  parameters: Record<string, any>;
  win_rate_range: string;
  sharpe_ratio_range: string;
  implemented: boolean;
}

export interface StrategyResponse {
  strategies: Strategy[];
  total_count: number;
  implemented_count: number;
  last_updated: string;
}
