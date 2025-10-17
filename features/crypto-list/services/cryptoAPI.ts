import { BaseAPI } from "@/shared";

interface CryptoMarketParams {
  vs_currency: string;
  order?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  atl_change_percentage: number;
  last_updated: string;
}

const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";

const cryptoAPI = BaseAPI.getInstance(COINGECKO_API_BASE_URL);

export const getCryptoCoins = async (
  params: CryptoMarketParams
): Promise<CryptoCoin[]> => {
  return cryptoAPI.get<CryptoCoin[]>(
    "coins/markets",
    params as Record<string, string | number>
  );
};
