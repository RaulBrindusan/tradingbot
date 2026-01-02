'use client';

import { useState, useEffect } from 'react';
import { Strategy, StrategyResponse } from '@/app/types/strategy';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';

interface StrategySelection {
  [key: string]: boolean;
}

const categoryColors: Record<string, string> = {
  'Trend Following': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Mean Reversion': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Momentum': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Volatility': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Volume': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'Statistical Arbitrage': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'Multi-Indicator': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Breakout': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const difficultyColors: Record<string, string> = {
  'Beginner': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'Intermediate': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  'Advanced': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'Expert': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showImplementedOnly, setShowImplementedOnly] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [implementedCount, setImplementedCount] = useState(0);
  const [selectedStrategies, setSelectedStrategies] = useState<StrategySelection>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStrategies();
    loadSelectedStrategies();
  }, []);

  useEffect(() => {
    filterStrategies();
  }, [strategies, selectedCategory, selectedDifficulty, showImplementedOnly]);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/strategies');

      if (!response.ok) {
        throw new Error('Failed to fetch strategies');
      }

      const data: StrategyResponse = await response.json();
      setStrategies(data.strategies);
      setFilteredStrategies(data.strategies);
      setTotalCount(data.total_count);
      setImplementedCount(data.implemented_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedStrategies = async () => {
    try {
      const response = await fetch('/api/strategies/selection');
      if (response.ok) {
        const data = await response.json();
        setSelectedStrategies(data.selected_strategies || {});
      }
    } catch (err) {
      console.error('Failed to load selected strategies:', err);
    }
  };

  const filterStrategies = () => {
    let filtered = [...strategies];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(s => s.difficulty === selectedDifficulty);
    }

    if (showImplementedOnly) {
      filtered = filtered.filter(s => s.implemented);
    }

    setFilteredStrategies(filtered);
  };

  const toggleStrategy = (code: string, implemented: boolean) => {
    if (!implemented) {
      setSaveMessage('⚠️ This strategy is not yet implemented');
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setSelectedStrategies(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const saveSelectedStrategies = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);

      const response = await fetch('/api/strategies/selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selected_strategies: selectedStrategies
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save strategy selection');
      }

      setSaveMessage('✓ Strategy selection saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage('✗ Failed to save strategy selection');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getSelectedCount = () => {
    return Object.values(selectedStrategies).filter(Boolean).length;
  };

  const categories = ['All', ...Array.from(new Set(strategies.map(s => s.category)))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900 dark:text-gray-100">Loading strategies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Trading Strategies</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Top {totalCount} algorithmic trading strategies ranked by performance and reliability
        </p>
        <div className="mt-2 flex gap-4 text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            <strong>Total:</strong> {totalCount} strategies
          </span>
          <span className="text-green-600 dark:text-green-400">
            <strong>Implemented:</strong> {implementedCount}
          </span>
          <span className="text-orange-600 dark:text-orange-400">
            <strong>Planned:</strong> {totalCount - implementedCount}
          </span>
          <span className="text-blue-600 dark:text-blue-400">
            <strong>Selected:</strong> {getSelectedCount()}
          </span>
        </div>
      </div>

      {/* Save Selection Button */}
      <Card className="mb-6 p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="text-gray-900 dark:text-gray-100">
            <h3 className="font-semibold mb-1">Strategy Selection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select which strategies the bot should use for trading. You can select multiple strategies.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {saveMessage && (
              <span className={`text-sm ${
                saveMessage.includes('✓')
                  ? 'text-green-600 dark:text-green-400'
                  : saveMessage.includes('⚠️')
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {saveMessage}
              </span>
            )}
            <Button
              onClick={saveSelectedStrategies}
              disabled={saving || getSelectedCount() === 0}
              variant="primary"
            >
              {saving ? 'Saving...' : `Save Selection (${getSelectedCount()})`}
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="mb-6 p-4 bg-white dark:bg-gray-800">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showImplementedOnly}
                onChange={(e) => setShowImplementedOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-900 dark:text-gray-100">Implemented only</span>
            </label>
          </div>

          <div className="ml-auto">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredStrategies.length} of {totalCount}
            </span>
          </div>
        </div>
      </Card>

      {/* Strategy List */}
      <div className="grid gap-4">
        {filteredStrategies.map((strategy) => (
          <Card key={strategy.code} className="p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
            <div className="flex items-start gap-4">
              {/* Selection Checkbox */}
              <div className="flex-shrink-0 pt-2">
                <input
                  type="checkbox"
                  checked={selectedStrategies[strategy.code] || false}
                  onChange={() => toggleStrategy(strategy.code, strategy.implemented)}
                  disabled={!strategy.implemented}
                  className="w-5 h-5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  title={strategy.implemented ? 'Select this strategy' : 'Strategy not yet implemented'}
                />
              </div>

              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                  strategy.rank <= 3
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                    : strategy.rank <= 10
                    ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  #{strategy.rank}
                </div>
              </div>

              <div className="flex-grow">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-semibold mb-1 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      {strategy.name}
                      {strategy.implemented && (
                        <Badge variant="success" className="text-xs">✓ Implemented</Badge>
                      )}
                      {selectedStrategies[strategy.code] && (
                        <Badge variant="info" className="text-xs bg-blue-500 dark:bg-blue-600 text-white dark:text-white">● Active</Badge>
                      )}
                    </h2>
                    <div className="flex gap-2 mb-2">
                      <Badge className={categoryColors[strategy.category]}>
                        {strategy.category}
                      </Badge>
                      <Badge className={difficultyColors[strategy.difficulty]}>
                        {strategy.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {strategy.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Best Timeframes
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {strategy.timeframes.map(tf => (
                        <span
                          key={tf}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-xs font-mono"
                        >
                          {tf}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Win Rate
                    </div>
                    <div className="text-green-600 dark:text-green-400 font-semibold">
                      {strategy.win_rate_range}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Sharpe Ratio
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-semibold">
                      {strategy.sharpe_ratio_range}
                    </div>
                  </div>
                </div>

                {/* Parameters */}
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Default Parameters
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <code className="text-xs text-gray-900 dark:text-gray-100">
                      {JSON.stringify(strategy.parameters, null, 2)}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredStrategies.length === 0 && (
        <Card className="p-8 text-center bg-white dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">No strategies match your filters.</p>
          <Button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setShowImplementedOnly(false);
            }}
            variant="secondary"
            className="mt-4"
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>Note:</strong> Rankings are based on research from leading algorithmic trading platforms (2025).
          Win rates and Sharpe ratios are typical ranges observed in backtesting and may vary based on market conditions,
          timeframes, and parameter optimization. Only implemented strategies can be selected for trading.
        </p>
      </div>
    </div>
  );
}
