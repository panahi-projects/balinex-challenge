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

export interface CoinDetailsProps {
  symbol: string;
  vsCurrency?: string;
  initialData?: {
    data: any | null;
    success: boolean;
    error?: string;
    timestamp: number;
  };
}

export interface UseCoinDetailsProps {
  symbol: string;
  vsCurrency?: string;
  enabled?: boolean;
  initialData?: {
    data: any | null;
    success: boolean;
    error?: string;
    timestamp: number;
  };
}

export interface UseCoinDetailsReturn {
  data: CoinDetailsType | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: number | null;
}

export interface CryptoDetailsServerParams {
  symbol: string;
  vsCurrency?: string;
}

export interface CryptoDetailsServerResponse {
  data: CoinDetailsType | null;
  success: boolean;
  error?: string;
  timestamp: number;
}
