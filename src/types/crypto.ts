export interface Crypto {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export interface PriceUpdate {
  id: string;
  price: number;
}

interface MarketData {
  current_price: {
    usd: number;
  };
  market_cap: {
    usd: number;
  };
  total_volume: {
    usd: number;
  };
  price_change_percentage_24h: number;
}

export interface CryptoDetail {
  id: string;
  name: string;
  symbol: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  categories: string[];
  market_data: MarketData;
  description: {
    en: string;
  };
}
