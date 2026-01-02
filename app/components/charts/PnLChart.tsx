'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';

export function PnLChart() {
  const dailyPnl = usePortfolioStore((state) => state.performance?.daily_pnl) || [];
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  // Color palette based on theme
  const colors = {
    grid: isDark ? '#374151' : '#e5e7eb',
    axis: isDark ? '#9ca3af' : '#6b7280',
    line: isDark ? '#10b981' : '#10b981',
    tooltipBg: isDark ? '#1f2937' : '#ffffff',
    tooltipBorder: isDark ? '#374151' : '#e5e7eb',
    tooltipText: isDark ? '#f3f4f6' : '#111827',
  };

  if (!dailyPnl || dailyPnl.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily P&L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No performance data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Reverse to show oldest first
  const chartData = [...dailyPnl].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily P&L</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke={colors.axis}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                stroke={colors.axis}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                formatter={(value: number | undefined) => [value !== undefined ? formatCurrency(value) : '$0.00', 'P&L']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
                contentStyle={{
                  backgroundColor: colors.tooltipBg,
                  border: `1px solid ${colors.tooltipBorder}`,
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: colors.tooltipText
                }}
              />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke={colors.line}
                strokeWidth={2}
                dot={{ fill: colors.line, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
