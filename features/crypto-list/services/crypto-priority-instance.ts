import { NormalizerFactory } from "@/features/crypto-list/normalizers";
import {
  CoinGeckoCryptoData,
  ScrapedCryptoData,
} from "@/features/crypto-list/types";
import {
  BaseAPI,
  CryptoCurrency,
  CryptoPriorityAPI,
  scrapeCryptoData,
} from "@/shared";

interface CryptoMarketParams {
  vs_currency: string;
  order?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}

const cryptoPriorityAPI = new CryptoPriorityAPI();

cryptoPriorityAPI.addEndpoint({
  name: "CoinGecko",
  priority: 1,
  timeout: 8000,
  handler: async (params: CryptoMarketParams): Promise<CryptoCurrency[]> => {
    const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";
    const api = BaseAPI.getInstance(COINGECKO_API_BASE_URL);

    // Fetch raw data from CoinGecko
    const rawData = await api.get<CoinGeckoCryptoData[]>(
      "coins/markets",
      params as Record<string, string | number>
    );

    // Normalize CoinGecko data using the normalizer
    return NormalizerFactory.normalizeDataWithSource<CoinGeckoCryptoData>(
      rawData,
      "coinGecko"
    );
  },
});

cryptoPriorityAPI.addEndpoint({
  name: "Scraping-Fallback",
  priority: 2,
  timeout: 10000,
  handler: async (params: CryptoMarketParams): Promise<CryptoCurrency[]> => {
    const cryptoData = await scrapeCryptoData(
      "https://coinmarketcap.com/all/views/all/"
    );

    console.log("cryptoData length", cryptoData.length);

    // Apply pagination to scraped data
    const { per_page = 100, page = 1 } = params;
    const startIndex = (page - 1) * per_page;
    const endIndex = startIndex + per_page;

    const paginatedData = cryptoData.slice(startIndex, endIndex);

    // Normalize scraped data using the normalizer
    return NormalizerFactory.normalizeDataWithSource<ScrapedCryptoData>(
      paginatedData,
      "scraping"
    );
  },
});

export { cryptoPriorityAPI };
