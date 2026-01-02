export interface SymbolInfo {
  symbol: string;
  name: string;
  category: 'stock' | 'etf' | 'crypto' | 'commodity' | 'index' | 'forex';
  popular?: boolean;
}

export const TRADING_SYMBOLS: SymbolInfo[] = [
  // ===== POPULAR STOCKS =====
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stock', popular: true },
  { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'stock', popular: true },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)', category: 'stock', popular: true },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'stock', popular: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stock', popular: true },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'stock', popular: true },
  { symbol: 'META', name: 'Meta Platforms Inc. (Facebook)', category: 'stock', popular: true },
  { symbol: 'NFLX', name: 'Netflix Inc.', category: 'stock', popular: true },
  { symbol: 'AMD', name: 'Advanced Micro Devices', category: 'stock', popular: true },
  { symbol: 'INTC', name: 'Intel Corporation', category: 'stock', popular: true },

  // ===== OTHER TECH STOCKS =====
  { symbol: 'ORCL', name: 'Oracle Corporation', category: 'stock' },
  { symbol: 'ADBE', name: 'Adobe Inc.', category: 'stock' },
  { symbol: 'CRM', name: 'Salesforce Inc.', category: 'stock' },
  { symbol: 'CSCO', name: 'Cisco Systems', category: 'stock' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', category: 'stock' },
  { symbol: 'QCOM', name: 'Qualcomm Inc.', category: 'stock' },
  { symbol: 'TXN', name: 'Texas Instruments', category: 'stock' },
  { symbol: 'NOW', name: 'ServiceNow Inc.', category: 'stock' },
  { symbol: 'SNOW', name: 'Snowflake Inc.', category: 'stock' },
  { symbol: 'PLTR', name: 'Palantir Technologies', category: 'stock' },

  // ===== FINANCE & BANKING =====
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', category: 'stock', popular: true },
  { symbol: 'BAC', name: 'Bank of America Corp.', category: 'stock' },
  { symbol: 'WFC', name: 'Wells Fargo & Company', category: 'stock' },
  { symbol: 'GS', name: 'Goldman Sachs Group', category: 'stock' },
  { symbol: 'MS', name: 'Morgan Stanley', category: 'stock' },
  { symbol: 'BLK', name: 'BlackRock Inc.', category: 'stock' },
  { symbol: 'V', name: 'Visa Inc.', category: 'stock', popular: true },
  { symbol: 'MA', name: 'Mastercard Inc.', category: 'stock' },
  { symbol: 'PYPL', name: 'PayPal Holdings', category: 'stock' },
  { symbol: 'SQ', name: 'Block Inc. (Square)', category: 'stock' },

  // ===== CONSUMER & RETAIL =====
  { symbol: 'WMT', name: 'Walmart Inc.', category: 'stock' },
  { symbol: 'COST', name: 'Costco Wholesale', category: 'stock' },
  { symbol: 'HD', name: 'Home Depot Inc.', category: 'stock' },
  { symbol: 'NKE', name: 'Nike Inc.', category: 'stock' },
  { symbol: 'SBUX', name: 'Starbucks Corporation', category: 'stock' },
  { symbol: 'MCD', name: "McDonald's Corporation", category: 'stock' },
  { symbol: 'DIS', name: 'Walt Disney Company', category: 'stock', popular: true },
  { symbol: 'ABNB', name: 'Airbnb Inc.', category: 'stock' },
  { symbol: 'UBER', name: 'Uber Technologies', category: 'stock' },
  { symbol: 'LYFT', name: 'Lyft Inc.', category: 'stock' },

  // ===== HEALTHCARE & PHARMA =====
  { symbol: 'JNJ', name: 'Johnson & Johnson', category: 'stock' },
  { symbol: 'UNH', name: 'UnitedHealth Group', category: 'stock' },
  { symbol: 'PFE', name: 'Pfizer Inc.', category: 'stock' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', category: 'stock' },
  { symbol: 'MRK', name: 'Merck & Co.', category: 'stock' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific', category: 'stock' },
  { symbol: 'ABT', name: 'Abbott Laboratories', category: 'stock' },
  { symbol: 'DHR', name: 'Danaher Corporation', category: 'stock' },
  { symbol: 'MRNA', name: 'Moderna Inc.', category: 'stock' },
  { symbol: 'GILD', name: 'Gilead Sciences', category: 'stock' },

  // ===== ENERGY & UTILITIES =====
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', category: 'stock' },
  { symbol: 'CVX', name: 'Chevron Corporation', category: 'stock' },
  { symbol: 'COP', name: 'ConocoPhillips', category: 'stock' },
  { symbol: 'SLB', name: 'Schlumberger Limited', category: 'stock' },
  { symbol: 'NEE', name: 'NextEra Energy', category: 'stock' },
  { symbol: 'DUK', name: 'Duke Energy', category: 'stock' },

  // ===== AUTOMOTIVE & TRANSPORTATION =====
  { symbol: 'F', name: 'Ford Motor Company', category: 'stock' },
  { symbol: 'GM', name: 'General Motors', category: 'stock' },
  { symbol: 'RIVN', name: 'Rivian Automotive', category: 'stock' },
  { symbol: 'LCID', name: 'Lucid Group Inc.', category: 'stock' },
  { symbol: 'NIO', name: 'NIO Inc.', category: 'stock' },
  { symbol: 'BA', name: 'Boeing Company', category: 'stock' },
  { symbol: 'LUV', name: 'Southwest Airlines', category: 'stock' },
  { symbol: 'DAL', name: 'Delta Air Lines', category: 'stock' },

  // ===== COMMUNICATIONS & MEDIA =====
  { symbol: 'T', name: 'AT&T Inc.', category: 'stock' },
  { symbol: 'VZ', name: 'Verizon Communications', category: 'stock' },
  { symbol: 'CMCSA', name: 'Comcast Corporation', category: 'stock' },
  { symbol: 'TMUS', name: 'T-Mobile US Inc.', category: 'stock' },
  { symbol: 'SPOT', name: 'Spotify Technology', category: 'stock' },
  { symbol: 'RBLX', name: 'Roblox Corporation', category: 'stock' },

  // ===== POPULAR ETFs =====
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'etf', popular: true },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq-100)', category: 'etf', popular: true },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', category: 'etf', popular: true },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', category: 'etf' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'etf' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', category: 'etf' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', category: 'etf' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', category: 'etf' },
  { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', category: 'etf' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'etf' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', category: 'etf', popular: true },
  { symbol: 'SLV', name: 'iShares Silver Trust', category: 'etf' },
  { symbol: 'USO', name: 'United States Oil Fund', category: 'etf' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund', category: 'etf' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', category: 'etf' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund', category: 'etf' },
  { symbol: 'XLV', name: 'Health Care Select Sector SPDR Fund', category: 'etf' },
  { symbol: 'ARKK', name: 'ARK Innovation ETF', category: 'etf' },
  { symbol: 'ARKW', name: 'ARK Next Generation Internet ETF', category: 'etf' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', category: 'etf' },

  // ===== CRYPTO (if supported by broker) =====
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'crypto', popular: true },
  { symbol: 'ETHUSD', name: 'Ethereum', category: 'crypto', popular: true },

  // ===== COMMODITIES =====
  { symbol: 'GC=F', name: 'Gold Futures', category: 'commodity', popular: true },
  { symbol: 'SI=F', name: 'Silver Futures', category: 'commodity' },
  { symbol: 'CL=F', name: 'Crude Oil Futures', category: 'commodity' },
  { symbol: 'NG=F', name: 'Natural Gas Futures', category: 'commodity' },

  // ===== INDICES =====
  { symbol: '^GSPC', name: 'S&P 500 Index', category: 'index' },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', category: 'index' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', category: 'index' },
  { symbol: '^RUT', name: 'Russell 2000', category: 'index' },
  { symbol: '^VIX', name: 'CBOE Volatility Index', category: 'index' },
];

export const SYMBOL_CATEGORIES = {
  stock: 'Stocks',
  etf: 'ETFs',
  crypto: 'Cryptocurrency',
  commodity: 'Commodities',
  index: 'Indices',
  forex: 'Forex',
} as const;

export const getPopularSymbols = () => TRADING_SYMBOLS.filter(s => s.popular);

export const getSymbolsByCategory = (category: SymbolInfo['category']) =>
  TRADING_SYMBOLS.filter(s => s.category === category);

export const searchSymbols = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return TRADING_SYMBOLS.filter(
    s => s.symbol.toLowerCase().includes(lowerQuery) ||
         s.name.toLowerCase().includes(lowerQuery)
  );
};
