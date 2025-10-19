import type { CryptoCurrency } from "@/shared";

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: string;
  transactionValue?: string;
  percentChange?: string;
  image?: string;
  enable?: boolean;
}

export interface CryptoTableProps {
  initialData?: {
    data: CryptoCurrency[];
    source: string;
    customCount: number;
    timestamp: number;
    success: boolean;
    error?: string;
  };
}

export interface ViewMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
  totalLoaded: number;
  className?: string;
}

export interface UseCryptoDataProps {
  vs_currency?: string;
  order?: string;
  per_page?: number;
  refetchInterval?: number;
  initialData?: {
    data: CryptoCurrency[];
    source: string;
    customCount: number;
    timestamp: number;
    success: boolean;
    error?: string;
  };
}

export interface UseCryptoDataReturn {
  data: CryptoCurrency[];
  loading: boolean;
  error: string | null;
  source: string | null;
  lastUpdated: number | null;
  refetch: () => void;
  isRefreshing: boolean;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoadingMore: boolean;
  totalLoaded: number;
}

export interface CryptoMarketParams {
  vs_currency: string;
  order?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface CryptoServerParams {
  vs_currency?: string;
  order?: string;
  per_page?: number;
  page?: number;
}

export interface CryptoServerResponse {
  data: CryptoCurrency[];
  source: string;
  customCount: number;
  timestamp: number;
  success: boolean;
  error?: string;
}
