import { cryptoPriorityAPI } from "./crypto-priority-instance";
import { getValidCoinLogoAsync } from "@/shared/lib/coin-logo";
import { cryptoStorage } from "@/shared/lib/crypto-storage";
import { CryptoCurrency } from "@/shared";

interface CryptoServerParams {
  vs_currency?: string;
  order?: string;
  per_page?: number;
  page?: number;
}

interface CryptoServerResponse {
  data: CryptoCurrency[];
  source: string;
  customCount: number;
  timestamp: number;
  success: boolean;
  error?: string;
}

export async function fetchCryptoDataServer({
  vs_currency = "usd",
  order = "market_cap_desc",
  per_page = 20,
  page = 1,
}: CryptoServerParams = {}): Promise<CryptoServerResponse> {
  try {
    const params = {
      vs_currency,
      order,
      per_page,
      page,
    };

    const result = await cryptoPriorityAPI.fetchCryptoData(params);

    // Validate and set logo URLs server-side
    const dataWithValidatedLogos = await Promise.all(
      result.data.map(async (crypto) => {
        if (!crypto.image) {
          // If no image provided, validate and get the best available logo
          crypto.image = await getValidCoinLogoAsync(
            crypto.symbol,
            crypto.name
          );
        }
        return crypto;
      })
    );

    // Get custom cryptos and transform them to match CryptoCurrency format
    const customCryptos = cryptoStorage.getAllCustomCryptos();
    const transformedCustomCryptos = customCryptos.map((crypto) => ({
      id: crypto.id,
      rank: crypto.marketCapRank.toString(),
      name: crypto.name,
      symbol: crypto.symbol,
      price: crypto.currentPrice,
      image: crypto.image,
      change24h: crypto.priceChangePercentage24h,
      volume24h: crypto.totalVolume,
      marketCap: crypto.marketCap,
    }));

    const allData = [...transformedCustomCryptos, ...dataWithValidatedLogos];

    return {
      success: true,
      data: allData,
      source: result.source,
      customCount: customCryptos.length,
      timestamp: result.timestamp,
    };
  } catch (error: unknown) {
    console.error("Server-side crypto data fetch failed:", error);

    return {
      success: false,
      data: [],
      source: "error",
      customCount: 0,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Cache configuration for ISR
export const cryptoCacheConfig = {
  revalidate: 60, // Revalidate every 60 seconds
  tags: ["crypto-data"],
} as const;
