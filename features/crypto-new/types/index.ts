import { NewCryptoFormData } from "@/shared";

// Re-export the shared schema and types
export { NewCryptoFormSchema, type NewCryptoFormData } from "@/shared/schemas";

// API response types
export interface NewCryptoResponse {
  success: boolean;
  data?: NewCryptoData;
  message?: string;
  timestamp?: number;
  error?: string;
  details?: any;
}

export interface NewCryptoData {
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
  isCustom: boolean;
  description?: string;
  website?: string;
  twitter?: string;
  github?: string;
  createdAt: string;
}

export interface NewCryptoFormProps {
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

export interface UseCryptoNewReturn {
  createCrypto: (data: NewCryptoFormData) => Promise<NewCryptoResponse>;
  loading: boolean;
  error: string | null;
}
