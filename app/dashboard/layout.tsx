'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../components/ThemeToggle';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Paper Trading', href: '/dashboard/paper-trading' },
  { name: 'Strategies', href: '/dashboard/strategies' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [clientPathname, setClientPathname] = useState('');

  useEffect(() => {
    setClientPathname(pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Trading Bot
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex space-x-4" suppressHydrationWarning>
                {navigation.map((item) => {
                  // For Dashboard, only match exact path. For others, match if starts with the path
                  const isActive = item.href === '/dashboard'
                    ? clientPathname === '/dashboard'
                    : clientPathname === item.href || clientPathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
