'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { SymbolSelector } from './SymbolSelector';
import { useBotControlStore } from '../../store/useBotControlStore';
import { TRADING_SYMBOLS } from '../../lib/symbols';

export function SymbolSelectionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { symbols, updateSymbols } = useBotControlStore();
  const [tempSymbols, setTempSymbols] = useState(symbols);

  const handleOpen = () => {
    setTempSymbols(symbols);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    await updateSymbols(tempSymbols);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSymbols(symbols);
    setIsOpen(false);
  };

  return (
    <>
      {/* Selection Display Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trading Symbols</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {symbols.length} symbol{symbols.length !== 1 ? 's' : ''} selected for trading
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleOpen}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Symbols
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {symbols.map((symbol) => {
              const symbolInfo = TRADING_SYMBOLS.find(s => s.symbol === symbol);
              return (
                <div
                  key={symbol}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-blue-900 dark:text-blue-100">
                        {symbol}
                      </span>
                      {symbolInfo?.popular && (
                        <span className="text-yellow-500 text-xs" title="Popular">⭐</span>
                      )}
                    </div>
                    {symbolInfo && (
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {symbolInfo.name}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title="Select Trading Symbols"
        maxWidth="4xl"
      >
        <div className="space-y-4">
          <SymbolSelector
            selectedSymbols={tempSymbols}
            onSelectionChange={setTempSymbols}
            maxSelections={10}
          />

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
