'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeClient() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500">Redirecting...</div>
    </div>
  );
}
