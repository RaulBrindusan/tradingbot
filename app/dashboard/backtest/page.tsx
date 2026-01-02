'use client';

import { useState, useEffect } from 'react';
import { useBacktestStore } from '../../store/useBacktestStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatPercent } from '../../lib/utils';
import { useThemeStore } from '../../store/useThemeStore';

export default function BacktestPage() {
  const { results, currentResult, isRunning, error, runBacktest, fetchResults, deleteResult, clearError } = useBacktestStore();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  const [config, setConfig] = useState({
    symbols: ['AAPL'],
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    initial_capital: 100000,
    strategy: 'SMACrossover',
    short_window: 10,
    long_window: 50,
  });

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runBacktest(config);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this backtest result?')) {
      await deleteResult(id);
    }
  };

  const displayResult = currentResult || results[0];

  // Chart colors
  const chartColors = {
    grid: isDark ? '#374151' : '#e5e7eb',
    axis: isDark ? '#9ca3af' : '#6b7280',
    line: isDark ? '#3b82f6' : '#2563eb',
    tooltipBg: isDark ? '#1f2937' : '#ffffff',
    tooltipBorder: isDark ? '#374151' : '#e5e7eb',
    tooltipText: isDark ? '#f3f4f6' : '#111827',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Backtest</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Test your trading strategy against historical data</p>
      </div>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Backtest Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex justify-between items-center">
              <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              <button onClick={clearError} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symbol
                </label>
                <input
                  type="text"
                  value={config.symbols[0]}
                  onChange={(e) => setConfig({ ...config, symbols: [e.target.value.toUpperCase()] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="AAPL"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Capital
                </label>
                <input
                  type="number"
                  value={config.initial_capital}
                  onChange={(e) => setConfig({ ...config, initial_capital: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  min="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={config.start_date}
                  onChange={(e) => setConfig({ ...config, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={config.end_date}
                  onChange={(e) => setConfig({ ...config, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Short Window (SMA)
                </label>
                <input
                  type="number"
                  value={config.short_window}
                  onChange={(e) => setConfig({ ...config, short_window: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  min="2"
                  max="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Long Window (SMA)
                </label>
                <input
                  type="number"
                  value={config.long_window}
                  onChange={(e) => setConfig({ ...config, long_window: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  min="5"
                  max="200"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isRunning}
              className="w-full flex items-center justify-center"
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Backtest...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run Backtest
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {displayResult && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Return</p>
                <p className={`text-2xl font-bold ${displayResult.metrics.total_return >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(displayResult.metrics.total_return)}
                </p>
                <p className={`text-sm ${displayResult.metrics.total_return_pct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {displayResult.metrics.total_return_pct.toFixed(2)}%
                </p>
              </div>
            </Card>

            <Card>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {displayResult.metrics.win_rate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {displayResult.metrics.winning_trades}W / {displayResult.metrics.losing_trades}L
                </p>
              </div>
            </Card>

            <Card>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  -{displayResult.metrics.max_drawdown.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Trades: {displayResult.metrics.total_trades}
                </p>
              </div>
            </Card>

            <Card>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {displayResult.metrics.sharpe_ratio.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Final: {formatCurrency(displayResult.metrics.final_value)}
                </p>
              </div>
            </Card>
          </div>

          {/* Equity Curve */}
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayResult.equity_curve}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis
                      dataKey="date"
                      stroke={chartColors.axis}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      stroke={chartColors.axis}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                      contentStyle={{
                        backgroundColor: chartColors.tooltipBg,
                        border: `1px solid ${chartColors.tooltipBorder}`,
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: chartColors.tooltipText,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={chartColors.line}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trades */}
          <Card>
            <CardHeader>
              <CardTitle>Trades ({displayResult.trades.length})</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Symbol</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Side</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {displayResult.trades.map((trade, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{trade.date}</td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{trade.symbol}</td>
                      <td className="py-3 px-4">
                        <Badge variant={trade.side === 'buy' ? 'success' : 'danger'}>
                          {trade.side.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{trade.qty}</td>
                      <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{formatCurrency(trade.price)}</td>
                      <td className={`py-3 px-4 text-right font-medium ${trade.pnl !== undefined ? (trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : 'text-gray-500 dark:text-gray-400'}`}>
                        {trade.pnl !== undefined ? formatCurrency(trade.pnl) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Previous Results */}
      {results.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Backtests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.slice(1, 6).map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {result.config.symbols[0]}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {result.config.start_date} - {result.config.end_date}
                      </span>
                      <Badge
                        variant={result.metrics.total_return >= 0 ? 'success' : 'danger'}
                        className="text-xs"
                      >
                        {result.metrics.total_return >= 0 ? '+' : ''}{result.metrics.total_return_pct.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(result.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 ml-4"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
