import { create } from 'zustand';

interface MarketStatus {
  is_open: boolean;
  next_open: string | null;
  next_close: string | null;
  timestamp: string | null;
}

interface BotControlState {
  status: 'running' | 'paused' | 'stopped';
  mode: 'paper' | 'live';
  last_updated: string | null;
  error: string | null;
  isLoading: boolean;
  marketStatus: MarketStatus | null;
  symbols: string[];
}

interface BotControlStore extends BotControlState {
  fetchStatus: () => Promise<void>;
  fetchMarketStatus: () => Promise<void>;
  startBot: () => Promise<void>;
  pauseBot: () => Promise<void>;
  stopBot: () => Promise<void>;
  updateSymbols: (symbols: string[]) => Promise<void>;
}

export const useBotControlStore = create<BotControlStore>((set) => ({
  status: 'stopped',
  mode: 'paper',
  last_updated: null,
  error: null,
  isLoading: false,
  marketStatus: null,
  symbols: ['AAPL', 'MSFT', 'GOOGL', 'TSLA'], // Default popular symbols

  fetchMarketStatus: async () => {
    try {
      const response = await fetch('/api/market/status');
      if (!response.ok) {
        throw new Error('Failed to fetch market status');
      }
      const data = await response.json();
      set({ marketStatus: data });
    } catch (error) {
      console.error('Error fetching market status:', error);
    }
  },

  fetchStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/bot/status');
      if (!response.ok) {
        throw new Error('Failed to fetch bot status');
      }
      const data = await response.json();
      set({
        status: data.status,
        mode: data.mode,
        last_updated: data.last_updated,
        error: data.error,
        symbols: data.symbols || ['AAPL', 'MSFT', 'GOOGL', 'TSLA'],
        isLoading: false
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false
      });
    }
  },

  startBot: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/bot/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });

      if (!response.ok) {
        throw new Error('Failed to start bot');
      }

      const data = await response.json();
      set({
        status: data.state.status,
        last_updated: data.state.last_updated,
        error: null,
        isLoading: false
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false
      });
    }
  },

  pauseBot: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/bot/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause' })
      });

      if (!response.ok) {
        throw new Error('Failed to pause bot');
      }

      const data = await response.json();
      set({
        status: data.state.status,
        last_updated: data.state.last_updated,
        error: null,
        isLoading: false
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false
      });
    }
  },

  stopBot: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/bot/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' })
      });

      if (!response.ok) {
        throw new Error('Failed to stop bot');
      }

      const data = await response.json();
      set({
        status: data.state.status,
        last_updated: data.state.last_updated,
        error: null,
        isLoading: false
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false
      });
    }
  },

  updateSymbols: async (symbols: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/bot/symbols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols })
      });

      if (!response.ok) {
        throw new Error('Failed to update symbols');
      }

      const data = await response.json();
      set({
        symbols: data.symbols,
        last_updated: data.last_updated,
        error: null,
        isLoading: false
      });
    } catch (error) {
      set({
        error: (error as Error).message,
        isLoading: false
      });
    }
  },
}));
