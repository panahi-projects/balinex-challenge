import type { APIEndpoint, CryptoCurrency, CryptoMarketParams } from "../types";

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
