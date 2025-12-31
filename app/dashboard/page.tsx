'use client';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-black">Trading Bot Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6 mt-4">
        <h2 className="text-lg font-semibold mb-2 text-black">Status</h2>
        <p className="text-gray-600">Dashboard is loading successfully!</p>
        <p className="text-sm text-gray-500 mt-2">
          The Python bot will sync data to this dashboard in real-time.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-blue-800 font-medium">✅ Frontend is working!</p>
        <p className="text-blue-600 text-sm mt-1">
          Next: Start the Python bot to see your trading data here.
        </p>
      </div>
    </div>
  );
}
