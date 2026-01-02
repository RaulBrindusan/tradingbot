'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { ThemeProvider } from './components/ThemeProvider';

const ClientContent = dynamic(
  () => Promise.resolve(({ children }: { children: ReactNode }) => <>{children}</>),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    ),
  }
);

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ClientContent>{children}</ClientContent>
    </ThemeProvider>
  );
}
