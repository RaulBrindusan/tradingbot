'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';

export default function PaperTradingPage() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      // Add API call to reset portfolio here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      alert('Portfolio reset successfully!');
      setShowResetConfirm(false);
    } catch (error) {
      alert('Failed to reset portfolio');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Paper Trading</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure your paper trading environment and practice strategies risk-free
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trading Mode</CardTitle>
            <Badge variant="success" className="text-sm">
              Paper Trading Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    About Paper Trading
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Paper trading lets you test your strategies with simulated money in real market conditions.
                    All trades are executed through Alpaca's paper trading environment, so there's no real financial risk.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Environment</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Alpaca Paper</p>
              </div>

              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Initial Capital</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(100000)}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Data</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Real-Time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paper Trading Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Risk Management */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Risk Management</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Max Position Size</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Maximum % of portfolio per position</p>
                  </div>
                  <Badge variant="info">10%</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Risk Per Trade</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Maximum risk per individual trade</p>
                  </div>
                  <Badge variant="info">2%</Badge>
                </div>
              </div>
            </div>

            {/* Strategy Settings */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Strategy</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Active Strategy</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Currently running strategy</p>
                  </div>
                  <Badge variant="success">SMA Crossover</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Watchlist Symbols</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stocks being monitored</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default">AAPL</Badge>
                    <Badge variant="default">MSFT</Badge>
                    <Badge variant="default">GOOGL</Badge>
                    <Badge variant="default">TSLA</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>Reset Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                    Warning: This action cannot be undone
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                    Resetting your portfolio will:
                  </p>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1 ml-4 list-disc">
                    <li>Close all open positions</li>
                    <li>Clear all trade history</li>
                    <li>Reset capital to initial amount ($100,000)</li>
                    <li>Delete all performance data</li>
                  </ul>
                </div>
              </div>
            </div>

            {showResetConfirm ? (
              <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-900 dark:text-red-100 font-medium mb-4">
                  Are you absolutely sure? This will permanently delete all your paper trading data.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={handleReset}
                    disabled={isResetting}
                    className="flex-1"
                  >
                    {isResetting ? 'Resetting...' : 'Yes, Reset Portfolio'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowResetConfirm(false)}
                    disabled={isResetting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="danger"
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Portfolio to Initial State
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Paper Trading Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Real Market Data</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trade with actual market prices and conditions</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Zero Risk</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">No real money involved - perfect for testing</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Performance Tracking</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detailed metrics and analytics on all trades</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Automated Trading</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Let algorithms execute trades automatically</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
