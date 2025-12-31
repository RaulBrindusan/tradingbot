import { Trade, Position, Performance, StrategyConfig } from './types';

/**
 * localStorage wrapper for frontend state persistence
 * Used for settings, API keys, and temporary caching
 */

export const storage = {
  // Trades
  getTrades: (): Trade[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('trades');
    return data ? JSON.parse(data) : [];
  },

  setTrades: (trades: Trade[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('trades', JSON.stringify(trades));
  },

  // Positions
  getPositions: (): Position[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('positions');
    return data ? JSON.parse(data) : [];
  },

  setPositions: (positions: Position[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('positions', JSON.stringify(positions));
  },

  // Performance
  getPerformance: (): Performance | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('performance');
    return data ? JSON.parse(data) : null;
  },

  setPerformance: (performance: Performance) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('performance', JSON.stringify(performance));
  },

  // API Keys (Note: In production, these should be encrypted)
  getApiKeys: (): { apiKey: string; secretKey: string } | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('alpaca_keys');
    return data ? JSON.parse(data) : null;
  },

  setApiKeys: (keys: { apiKey: string; secretKey: string }) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('alpaca_keys', JSON.stringify(keys));
  },

  clearApiKeys: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('alpaca_keys');
  },

  // Strategy Configuration
  getStrategyConfig: (): StrategyConfig | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('strategy_config');
    return data ? JSON.parse(data) : null;
  },

  setStrategyConfig: (config: StrategyConfig) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('strategy_config', JSON.stringify(config));
  },

  // Watchlist
  getWatchlist: (): string[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('watchlist');
    return data ? JSON.parse(data) : ['AAPL', 'MSFT', 'GOOGL', 'TSLA'];
  },

  setWatchlist: (symbols: string[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('watchlist', JSON.stringify(symbols));
  },

  // Settings
  getSetting: (key: string): any => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(`setting_${key}`);
    return data ? JSON.parse(data) : null;
  },

  setSetting: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`setting_${key}`, JSON.stringify(value));
  },

  // Clear all data
  clearAll: () => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};
