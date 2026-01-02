'use client';

import { useEffect } from 'react';
import { useTradeStore } from '../store/useTradeStore';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { PnLChart } from '../components/charts/PnLChart';
import { PositionTable } from '../components/dashboard/PositionTable';
import { TradeHistory } from '../components/dashboard/TradeHistory';
import { BotControlPanel } from '../components/dashboard/BotControlPanel';
import { SymbolSelectionModal } from '../components/dashboard/SymbolSelectionModal';
import { MarketStatusBanner } from '../components/dashboard/MarketStatusBanner';
import { Card } from '../components/ui/Card';
import { formatCurrency, formatPercent, getColorClass } from '../lib/utils';

export default function DashboardPage() {
  const { fetchTrades, trades } = useTradeStore();
  const { fetchPositions, fetchPerformance, account, getTotalPnL, performance } = usePortfolioStore();

  useEffect(() => {
    // Call immediately
    fetchTrades();
    fetchPositions();
    fetchPerformance();

    // Set up polling
    const interval = setInterval(() => {
      fetchTrades();
      fetchPositions();
      fetchPerformance();
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const totalPnL = getTotalPnL();
  const totalPnLPct = account?.portfolio_value
    ? (totalPnL / (account.portfolio_value - totalPnL)) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Portfolio Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your paper trading performance and positions</p>
      </div>

      <MarketStatusBanner />

      <BotControlPanel />

      <SymbolSelectionModal />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Portfolio Value</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {account ? formatCurrency(account.portfolio_value) : '$0.00'}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cash</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {account ? formatCurrency(account.cash) : '$0.00'}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total P&L</p>
            <p className={`text-2xl font-bold ${getColorClass(totalPnL)}`}>
              {formatCurrency(totalPnL)}
            </p>
            {totalPnLPct !== 0 && (
              <p className={`text-sm ${getColorClass(totalPnLPct)}`}>
                {formatPercent(totalPnLPct / 100, 2)}
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Trades</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{trades.length}</p>
            {performance?.metrics.win_rate !== undefined && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatPercent(performance.metrics.win_rate, 0)} Win Rate
              </p>
            )}
          </div>
        </Card>
      </div>

      <PnLChart />
      <PositionTable />
      <TradeHistory limit={10} />
    </div>
  );
}
