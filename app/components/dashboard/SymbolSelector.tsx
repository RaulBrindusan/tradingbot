'use client';

import { useState, useMemo } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  TRADING_SYMBOLS,
  SYMBOL_CATEGORIES,
  getPopularSymbols,
  getSymbolsByCategory,
  searchSymbols,
  type SymbolInfo,
} from '../../lib/symbols';

interface SymbolSelectorProps {
  selectedSymbols: string[];
  onSelectionChange: (symbols: string[]) => void;
  maxSelections?: number;
}

export function SymbolSelector({
  selectedSymbols,
  onSelectionChange,
  maxSelections = 10,
}: SymbolSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SymbolInfo['category'] | 'popular' | 'all'>('all');

  const filteredSymbols = useMemo(() => {
    if (searchQuery) {
      return searchSymbols(searchQuery);
    }

    if (selectedCategory === 'popular') {
      return getPopularSymbols();
    }

    if (selectedCategory === 'all') {
      return TRADING_SYMBOLS;
    }

    return getSymbolsByCategory(selectedCategory);
  }, [searchQuery, selectedCategory]);

  const toggleSymbol = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      onSelectionChange(selectedSymbols.filter(s => s !== symbol));
    } else {
      if (selectedSymbols.length < maxSelections) {
        onSelectionChange([...selectedSymbols, symbol]);
      }
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  const selectPopular = () => {
    const popular = getPopularSymbols().slice(0, maxSelections).map(s => s.symbol);
    onSelectionChange(popular);
  };

  const categories: Array<{ key: typeof selectedCategory; label: string }> = [
    { key: 'popular', label: '⭐ Popular' },
    { key: 'all', label: 'All' },
    { key: 'stock', label: '📈 Stocks' },
    { key: 'etf', label: '📊 ETFs' },
    { key: 'crypto', label: '₿ Crypto' },
    { key: 'commodity', label: '🥇 Commodities' },
    { key: 'index', label: '📉 Indices' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedSymbols.length}/{maxSelections} symbols selected
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={selectPopular}
            className="text-sm"
            disabled={selectedSymbols.length === maxSelections}
          >
            Select Popular
          </Button>
          {selectedSymbols.length > 0 && (
            <Button
              variant="secondary"
              onClick={clearSelection}
              className="text-sm"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search symbols or names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Category Tabs */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.key
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Selected Symbols Display */}
          {selectedSymbols.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Selected Symbols:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSymbols.map((symbol) => {
                  const symbolInfo = TRADING_SYMBOLS.find(s => s.symbol === symbol);
                  return (
                    <Badge
                      key={symbol}
                      variant="info"
                      className="cursor-pointer hover:opacity-80 flex items-center gap-1"
                      onClick={() => toggleSymbol(symbol)}
                    >
                      {symbol}
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Symbol Grid */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-3">
              {filteredSymbols.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  No symbols found
                </div>
              ) : (
                filteredSymbols.map((symbolInfo) => {
                  const isSelected = selectedSymbols.includes(symbolInfo.symbol);
                  const isDisabled = !isSelected && selectedSymbols.length >= maxSelections;

                  return (
                    <button
                      key={symbolInfo.symbol}
                      onClick={() => toggleSymbol(symbolInfo.symbol)}
                      disabled={isDisabled}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : isDisabled
                          ? 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              isSelected
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {symbolInfo.symbol}
                            </span>
                            {symbolInfo.popular && (
                              <span className="text-yellow-500" title="Popular">⭐</span>
                            )}
                          </div>
                          <p className={`text-xs mt-1 truncate ${
                            isSelected
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {symbolInfo.name}
                          </p>
                          <span className={`text-xs ${
                            isSelected
                              ? 'text-blue-500 dark:text-blue-500'
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {SYMBOL_CATEGORIES[symbolInfo.category]}
                          </span>
                        </div>
                        {isSelected && (
                          <svg
                            className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Info Message */}
          {selectedSymbols.length >= maxSelections && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Maximum selection limit reached ({maxSelections} symbols). Remove a symbol to add a different one.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
