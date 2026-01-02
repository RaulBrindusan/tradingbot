'use client';

import { create } from 'zustand';

interface ThemeStore {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  systemTheme: 'dark' | 'light' | null;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'dark', // Default to dark
  systemTheme: null,

  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: newTheme });

    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  },

  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },

  initializeTheme: () => {
    if (typeof window === 'undefined') return;

    // Check localStorage first (user preference)
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;

    // Check system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    set({ systemTheme });

    // Priority: localStorage > default (dark)
    const theme = savedTheme || 'dark';

    set({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },
}));
