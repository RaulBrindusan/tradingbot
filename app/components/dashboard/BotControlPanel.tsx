'use client';

import { useEffect } from 'react';
import { useBotControlStore } from '../../store/useBotControlStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function BotControlPanel() {
  const { status, mode, error, isLoading, fetchStatus, startBot, pauseBot, stopBot } = useBotControlStore();

  useEffect(() => {
    // Fetch status on mount
    fetchStatus();

    // Poll status every 2 seconds
    const interval = setInterval(() => {
      fetchStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const getStatusBadgeVariant = () => {
    switch (status) {
      case 'running':
        return 'success';
      case 'paused':
        return 'warning';
      case 'stopped':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return (
          <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
        );
      case 'paused':
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
          </svg>
        );
      case 'stopped':
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bot Control</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant()} className="flex items-center gap-1.5">
              {getStatusIcon()}
              <span className="capitalize">{status}</span>
            </Badge>
            <Badge variant="info" className="text-xs">
              {mode === 'paper' ? 'Paper Trading' : 'Live Trading'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant={status === 'paused' ? 'primary' : 'secondary'}
            onClick={status === 'paused' ? startBot : pauseBot}
            disabled={isLoading || status === 'stopped'}
            className="flex-1 flex items-center justify-center"
          >
            {status === 'paused' ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resume Trading
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause Trading
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {status === 'running' && 'Trading automatically during market hours'}
                {status === 'paused' && 'Trading paused - will not execute new trades'}
                {status === 'stopped' && 'Waiting for market to open...'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 pl-6">
              Bot automatically starts when market opens and stops when market closes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
