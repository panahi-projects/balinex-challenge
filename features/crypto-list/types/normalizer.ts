import { CryptoCurrency } from "@/shared";

// Base interface for all crypto data sources
export interface BaseCryptoData {
  id: string;
  name: string;
  symbol: string;
  price: string | number;
  image?: string;
  change24h?: string | number;
  volume24h?: string | number;
  marketCap?: string | number;
  rank?: string | number;
}

// CoinGecko API response structure
export interface CoinGeckoCryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

// Scraped data structure
export interface ScrapedCryptoData {
  id: string;
  rank: string;
  name: string;
  symbol: string;
  price: string;
  change24h: string;
  image?: string;
  volume24h: string;
  marketCap?: string;
}

export interface CryptoDataNormalizer<T = any> {
  normalize(data: T[]): CryptoCurrency[];
  validate(data: T[]): boolean;
}

// Normalizer factory type
export type NormalizerFactory = () => CryptoDataNormalizer;

export type DataSource = "coinGecko" | "scraping" | "unknown";

export interface NormalizerRegistry {
  [key: string]: NormalizerFactory;
}
