'use client';

import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('./DashboardContent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500">Loading dashboard...</div>
    </div>
  ),
});

export default function DashboardClient() {
  return <DashboardContent />;
}
