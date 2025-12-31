import { create } from 'zustand';
import { Trade } from '../lib/types';

interface TradeStore {
  trades: Trade[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setTrades: (trades: Trade[]) => void;
  addTrade: (trade: Trade) => void;
  fetchTrades: () => Promise<void>;
  clearError: () => void;
}

export const useTradeStore = create<TradeStore>((set, get) => ({
  trades: [],
  isLoading: false,
  error: null,

  setTrades: (trades) => set({ trades }),

  addTrade: (trade) => set((state) => ({
    trades: [trade, ...state.trades]
  })),

  fetchTrades: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch from Next.js API route which reads bot's JSON file
      const response = await fetch('/api/trades');

      if (!response.ok) {
        throw new Error('Failed to fetch trades');
      }

      const data = await response.json();
      set({ trades: data.trades || [], isLoading: false });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null }),
}));
