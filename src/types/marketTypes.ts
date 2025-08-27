export type MarketInfo = {
  symbol: string;
  tabdealSymbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
};

export type MarketInfoSymbol = {
  symbol: string;
  tabdealSymbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  orderTypes?: string[];
  permissions?: string[];
};

type MarketPrice = {
  [symbol: string]: number;
};

export interface MarketState {
  prices: MarketPrice;
  socket: any;
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
}
