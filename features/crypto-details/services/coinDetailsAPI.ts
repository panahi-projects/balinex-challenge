import { type CoinDetailsResponse } from "../types";

// Service class for fetching coin details
export class CoinDetailsAPI {
  private static instance: CoinDetailsAPI;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = "/api/crypto";
  }

  public static getInstance(): CoinDetailsAPI {
    if (!CoinDetailsAPI.instance) {
      CoinDetailsAPI.instance = new CoinDetailsAPI();
    }
    return CoinDetailsAPI.instance;
  }

  public async getCoinDetails(
    symbol: string,
    vsCurrency: string = "usd"
  ): Promise<CoinDetailsResponse> {
    try {
      const queryParams = new URLSearchParams({
        vs_currency: vsCurrency,
      });

      const response = await fetch(
        `${this.baseUrl}/${symbol}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // We can add cache control for better performance
          next: {
            revalidate: 300, // Cache for 5 minutes
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error fetching coin details:", error);
      return {
        success: false,
        error: "Failed to fetch coin details",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public async getMultipleCoinDetails(
    symbols: string[],
    vsCurrency: string = "usd"
  ): Promise<CoinDetailsResponse[]> {
    const promises = symbols.map((symbol) =>
      this.getCoinDetails(symbol, vsCurrency)
    );

    try {
      const results = await Promise.allSettled(promises);
      return results.map((result) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          return {
            success: false,
            error: "Failed to fetch coin details",
            details: result.reason?.message || "Unknown error",
          };
        }
      });
    } catch (error) {
      console.error("Error fetching multiple coin details:", error);
      return symbols.map(() => ({
        success: false,
        error: "Failed to fetch coin details",
        details: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }
}

// Export singleton instance
export const coinDetailsAPI = CoinDetailsAPI.getInstance();
