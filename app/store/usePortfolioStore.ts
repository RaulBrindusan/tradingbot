import { create } from 'zustand';
import { Position, Account, Performance, DailyPnL } from '../lib/types';

interface PortfolioStore {
  positions: Position[];
  account: Account | null;
  performance: Performance | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPositions: (positions: Position[]) => void;
  setAccount: (account: Account) => void;
  setPerformance: (performance: Performance) => void;
  fetchPositions: () => Promise<void>;
  fetchPerformance: () => Promise<void>;
  clearError: () => void;

  // Computed values
  getTotalPnL: () => number;
  getDailyPnL: () => DailyPnL[];
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  positions: [],
  account: null,
  performance: null,
  isLoading: false,
  error: null,

  setPositions: (positions) => set({ positions }),

  setAccount: (account) => set({ account }),

  setPerformance: (performance) => set({ performance }),

  fetchPositions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/positions');

      if (!response.ok) {
        throw new Error('Failed to fetch positions');
      }

      const data = await response.json();
      set({
        positions: data.positions || [],
        account: data.account || null,
        isLoading: false
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false
      });
    }
  },

  fetchPerformance: async () => {
    try {
      const response = await fetch('/api/performance');

      if (!response.ok) {
        throw new Error('Failed to fetch performance');
      }

      const data = await response.json();
      set({ performance: data });
    } catch (error) {
      console.error('Error fetching performance:', error);
    }
  },

  clearError: () => set({ error: null }),

  getTotalPnL: () => {
    const state = get();
    return state.positions.reduce((sum, pos) => sum + pos.unrealized_pl, 0);
  },

  getDailyPnL: () => {
    const state = get();
    return state.performance?.daily_pnl || [];
  },
}));
