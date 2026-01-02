'use client';

import { usePortfolioStore } from '../../store/usePortfolioStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency, formatPercent, getColorClass } from '../../lib/utils';

export function PositionTable() {
  const positions = usePortfolioStore((state) => state.positions);

  if (positions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No open positions
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Positions</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Symbol</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Qty</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Avg Entry</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Current Price</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Market Value</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">P&L</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">P&L %</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.symbol} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{position.symbol}</td>
                <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{position.qty}</td>
                <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                  {formatCurrency(position.avg_entry_price)}
                </td>
                <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                  {formatCurrency(position.current_price)}
                </td>
                <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                  {formatCurrency(position.market_value)}
                </td>
                <td className={`py-3 px-4 text-right font-medium ${getColorClass(position.unrealized_pl)}`}>
                  {formatCurrency(position.unrealized_pl)}
                </td>
                <td className={`py-3 px-4 text-right font-medium ${getColorClass(position.unrealized_plpc)}`}>
                  {formatPercent(position.unrealized_plpc)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
