'use client';

import { useTradeStore } from '../../store/useTradeStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatDateTime } from '../../lib/utils';

interface TradeHistoryProps {
  limit?: number;
}

export function TradeHistory({ limit }: TradeHistoryProps) {
  const trades = useTradeStore((state) => state.trades);

  const displayTrades = limit ? trades.slice(0, limit) : trades;

  if (displayTrades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No trades yet
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'filled':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'default';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getSideColor = (side: string) => {
    return side === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Trade History
          {limit && trades.length > limit && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Showing {limit} of {trades.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Time</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Symbol</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Side</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Qty</th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Strategy</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayTrades.map((trade) => (
              <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-700">
                  {formatDateTime(trade.timestamp)}
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">{trade.symbol}</td>
                <td className={`py-3 px-4 font-medium uppercase ${getSideColor(trade.side)}`}>
                  {trade.side}
                </td>
                <td className="py-3 px-4 text-right text-gray-700">{trade.qty}</td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {formatCurrency(trade.price)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{trade.strategy}</td>
                <td className="py-3 px-4">
                  <Badge variant={getStatusVariant(trade.status)}>
                    {trade.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
