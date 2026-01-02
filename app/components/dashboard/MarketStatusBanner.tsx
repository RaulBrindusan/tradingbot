'use client';

import { useEffect } from 'react';
import { useBotControlStore } from '../../store/useBotControlStore';

export function MarketStatusBanner() {
  const { marketStatus, fetchMarketStatus } = useBotControlStore();

  useEffect(() => {
    fetchMarketStatus();
    const interval = setInterval(fetchMarketStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [fetchMarketStatus]);

  if (!marketStatus) {
    return null;
  }

  const isOpen = marketStatus.is_open;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 p-3 transition-all ${
        isOpen
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-700'
          : 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-300 dark:border-red-700'
      }`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-20">
        <div
          className={`absolute inset-0 ${
            isOpen ? 'bg-green-400 dark:bg-green-600' : 'bg-red-400 dark:bg-red-600'
          }`}
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(255,255,255,.05) 35px,
              rgba(255,255,255,.05) 70px
            )`,
          }}
        />
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Pulsing indicator */}
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isOpen
                  ? 'bg-green-500 dark:bg-green-600'
                  : 'bg-red-500 dark:bg-red-600'
              }`}
            >
              {isOpen ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            {isOpen && (
              <>
                <div className="absolute inset-0 rounded-full bg-green-500 dark:bg-green-600 animate-ping opacity-75" />
                <div className="absolute inset-0 rounded-full bg-green-500 dark:bg-green-600 animate-pulse" />
              </>
            )}
          </div>

          {/* Status text */}
          <div>
            <h2
              className={`text-xl font-bold leading-tight ${
                isOpen
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-red-900 dark:text-red-100'
              }`}
            >
              {isOpen ? 'Market is OPEN' : 'Market is CLOSED'}
            </h2>
            <p
              className={`text-xs leading-tight ${
                isOpen
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}
            >
              {isOpen ? (
                <>
                  Trading is active{' '}
                  {marketStatus.next_close && (
                    <span className="opacity-80">
                      • Closes at {new Date(marketStatus.next_close).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </>
              ) : (
                <>
                  Trading is paused{' '}
                  {marketStatus.next_open && (
                    <span className="opacity-80">
                      • Opens at {new Date(marketStatus.next_open).toLocaleString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Live indicator badge */}
        <div className="flex flex-col items-end gap-1">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
              isOpen
                ? 'bg-green-600 dark:bg-green-700'
                : 'bg-red-600 dark:bg-red-700'
            }`}
          >
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              {isOpen && (
                <div className="absolute inset-0 bg-white rounded-full animate-ping" />
              )}
            </div>
            <span className="text-white font-semibold text-xs uppercase tracking-wide">
              {isOpen ? 'Live' : 'Offline'}
            </span>
          </div>

          {marketStatus.timestamp && (
            <span className="text-[10px] opacity-70 text-gray-600 dark:text-gray-400">
              Updated {new Date(marketStatus.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
