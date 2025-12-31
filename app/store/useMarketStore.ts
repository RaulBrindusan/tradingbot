import { create } from 'zustand';
import { Quote, Bar, MarketClock } from '@/lib/types';

interface MarketStore {
  quotes: Record<string, Quote>;
  candles: Record<string, Bar[]>;
  marketClock: MarketClock | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setQuote: (symbol: string, quote: Quote) => void;
  setCandles: (symbol: string, candles: Bar[]) => void;
  setMarketClock: (clock: MarketClock) => void;
  fetchQuote: (symbol: string) => Promise<void>;
  fetchCandles: (symbol: string, timeframe?: string) => Promise<void>;
  fetchMarketClock: () => Promise<void>;
  clearError: () => void;
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  quotes: {},
  candles: {},
  marketClock: null,
  isLoading: false,
  error: null,

  setQuote: (symbol, quote) => set((state) => ({
    quotes: { ...state.quotes, [symbol]: quote }
  })),

  setCandles: (symbol, candles) => set((state) => ({
    candles: { ...state.candles, [symbol]: candles }
  })),

  setMarketClock: (clock) => set({ marketClock: clock }),

  fetchQuote: async (symbol: string) => {
    try {
      const response = await fetch(`/api/market-data/quote?symbol=${symbol}`);

      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }

      const data = await response.json();
      get().setQuote(symbol, data.quote);
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchCandles: async (symbol: string, timeframe = '1Min') => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/market-data/bars?symbol=${symbol}&timeframe=${timeframe}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch candles');
      }

      const data = await response.json();
      get().setCandles(symbol, data.bars);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false
      });
    }
  },

  fetchMarketClock: async () => {
    try {
      const response = await fetch('/api/market-data/clock');

      if (!response.ok) {
        throw new Error('Failed to fetch market clock');
      }

      const data = await response.json();
      set({ marketClock: data });
    } catch (error) {
      console.error('Error fetching market clock:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
