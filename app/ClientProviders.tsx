'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const ClientContent = dynamic(
  () => Promise.resolve(({ children }: { children: ReactNode }) => <>{children}</>),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    ),
  }
);

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <ClientContent>{children}</ClientContent>;
}
