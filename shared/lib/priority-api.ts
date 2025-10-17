import BaseAPI from "./base-api";
import { CryptoCurrency } from "./scraper";

// interface CryptoCoin {
//   id: string;
//   symbol: string;
//   name: string;
//   image: string;
//   current_price: number;
//   market_cap: number;
//   market_cap_rank: number;
//   total_volume: number;
//   high_24h: number;
//   low_24h: number;
//   price_change_24h: number;
//   price_change_percentage_24h: number;
//   circulating_supply: number;
//   total_supply: number | null;
//   max_supply: number | null;
//   ath: number;
//   ath_change_percentage: number;
//   atl: number;
//   atl_change_percentage: number;
//   last_updated: string;
// }

interface CryptoMarketParams {
  vs_currency: string;
  order?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}

interface APIEndpoint {
  name: string;
  priority: number;
  handler: (params: CryptoMarketParams) => Promise<CryptoCurrency[]>;
  timeout?: number;
}

export class CryptoPriorityAPI {
  private endpoints: APIEndpoint[];
  private fallbackEnabled: boolean;

  constructor() {
    this.endpoints = [];
    this.fallbackEnabled = true;
  }

  public addEndpoint(endpoint: APIEndpoint): void {
    this.endpoints.push(endpoint);
    this.endpoints.sort((a, b) => a.priority - b.priority);
  }
  public setFallbackEnabled(enabled: boolean): void {
    this.fallbackEnabled = enabled;
  }

  public async fetchCryptoData(params: CryptoMarketParams): Promise<{
    data: CryptoCurrency[];
    source: string;
    timestamp: number;
  }> {
    const errors: { source: string; error: Error }[] = [];

    for (const endpoint of this.endpoints) {
      try {
        console.log(`Trying ${endpoint.name}...`);

        const data = await this.executeWithTimeout(
          endpoint.handler(params),
          endpoint.timeout || 10000
        );

        console.log(`Successfully fetched data from ${endpoint.name}`);
        return {
          data,
          source: endpoint.name,
          timestamp: Date.now(),
        };
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint.name}:`, error);
        errors.push({
          source: endpoint.name,
          error: error as Error,
        });

        // Continue to next endpoint
        continue;
      }
    }

    // If we reach here, all endpoints failed
    throw new AggregateError(
      errors,
      `All API endpoints failed: ${errors.map((e) => `${e.source}: ${e.error.message}`).join("; ")}`
    );
  }

  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }
}

// const cryptoPriorityAPI = new CryptoPriorityAPI();

// Primary: CoinGecko API
// cryptoPriorityAPI.addEndpoint({
//   name: "CoinGecko",
//   priority: 1,
//   timeout: 8000,
//   handler: async (params: CryptoMarketParams) => {
//     const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";
//     const api = BaseAPI.getInstance(COINGECKO_API_BASE_URL);

//     return api.get<CryptoCoin[]>(
//       "coins/markets",
//       params as Record<string, string | number>
//     );
//   },
// });

// Secondary: Scraping API Fallback
// cryptoPriorityAPI.addEndpoint({
//   name: "Scraping-Fallback",
//   priority: 2,
//   timeout: 15000,
//   handler: async (params: CryptoMarketParams) => {
//     // Convert params to query string for your scraping API if needed
//     const queryParams = new URLSearchParams();
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         queryParams.append(key, String(value));
//       }
//     });

//     const response = await fetch(
//       `/api/crypto/scrape?${queryParams.toString()}`
//     );

//     if (!response.ok) {
//       throw new Error(`Scraping API failed with status: ${response.status}`);
//     }

//     return response.json();
//   },
// });
