import dynamic from 'next/dynamic';

// Disable SSR for the entire dashboard to prevent hydration mismatches
// This is necessary because components use client-side features like:
// - Date/time formatting (timezone-dependent)
// - Client-side data fetching
// - Browser APIs
const DashboardContent = dynamic(() => import('./DashboardContent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500">Loading dashboard...</div>
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardContent />;
}
