// Simplified coin details interface
export interface CoinDetailsType {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: string;
  marketCap: string;
  totalVolume: string;
  priceChangePercentage24h: string;
  marketCapRank: number;
  lastUpdated: string;
}

export interface CoinDetailsResponse {
  success: boolean;
  data?: CoinDetailsType;
  source?: string;
  timestamp?: number;
  error?: string;
  details?: string;
}
