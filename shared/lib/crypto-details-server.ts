import { coinDetailsAPI } from "@/features/crypto-details/services/coinDetailsAPI";
import {
  CoinDetailsType,
  CoinDetailsResponse,
} from "@/features/crypto-details/types";

interface CryptoDetailsServerParams {
  symbol: string;
  vsCurrency?: string;
}

interface CryptoDetailsServerResponse {
  data: CoinDetailsType | null;
  success: boolean;
  error?: string;
  timestamp: number;
}

export async function fetchCryptoDetailsServer({
  symbol,
  vsCurrency = "usd",
}: CryptoDetailsServerParams): Promise<CryptoDetailsServerResponse> {
  try {
    const response: CoinDetailsResponse = await coinDetailsAPI.getCoinDetails(
      symbol,
      vsCurrency
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        timestamp: response.timestamp || Date.now(),
      };
    } else {
      return {
        success: false,
        data: null,
        timestamp: Date.now(),
        error: response.error || "Failed to fetch coin details",
      };
    }
  } catch (error: unknown) {
    console.error("Server-side crypto details fetch failed:", error);

    return {
      success: false,
      data: null,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Cache configuration for ISR
export const cryptoDetailsCacheConfig = {
  revalidate: 300, // Revalidate every 5 minutes for details
  tags: ["crypto-details"],
} as const;
