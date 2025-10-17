import { CryptoCurrency } from "@/shared";
import {
  CryptoDataNormalizer,
  DataSource,
  NormalizerRegistry,
} from "../types/normalizer";
import { coinGeckoNormalizer } from "./coinGeckoNormalizer";
import { scrapingNormalizer } from "./scrapingNormalizer";

export class NormalizerFactory {
  private static registry: NormalizerRegistry = {
    coinGecko: () => coinGeckoNormalizer,
    scraping: () => scrapingNormalizer,
  };

  // Get normalizer for a specific data source
  static getNormalizer(source: DataSource): CryptoDataNormalizer {
    const factory = this.registry[source];
    if (!factory) {
      throw new Error(`No normalizer found for data source: ${source}`);
    }
    return factory();
  }

  //Register a new normalizer for a data source
  static registerNormalizer(
    source: string,
    factory: () => CryptoDataNormalizer
  ): void {
    this.registry[source] = factory;
  }

  //Detect data source from the data structure
  static detectDataSource(data: any[]): DataSource {
    if (!Array.isArray(data) || data.length === 0) {
      return "unknown";
    }

    const sample = data[0];

    // Check for CoinGecko structure
    if (
      sample.hasOwnProperty("current_price") &&
      sample.hasOwnProperty("market_cap_rank") &&
      sample.hasOwnProperty("price_change_percentage_24h") &&
      sample.hasOwnProperty("total_volume")
    ) {
      return "coinGecko";
    }

    // Check for Scraped structure
    if (
      sample.hasOwnProperty("rank") &&
      sample.hasOwnProperty("change24h") &&
      sample.hasOwnProperty("volume24h") &&
      typeof sample.rank === "string"
    ) {
      return "scraping";
    }

    return "unknown";
  }

  //Normalize data with automatic source detection
  static normalizeData(data: any[]): CryptoCurrency[] {
    const source = this.detectDataSource(data);

    if (source === "unknown") {
      throw new Error("Unable to detect data source from provided data");
    }

    const normalizer = this.getNormalizer(source);

    if (!normalizer.validate(data)) {
      throw new Error(`Data validation failed for source: ${source}`);
    }

    return normalizer.normalize(data);
  }

  // Normalize data with explicit source
  static normalizeDataWithSource<T = any>(
    data: T[],
    source: DataSource
  ): CryptoCurrency[] {
    const normalizer = this.getNormalizer(source);

    if (!normalizer.validate(data)) {
      throw new Error(`Data validation failed for source: ${source}`);
    }

    return normalizer.normalize(data);
  }

  //Get all registered data sources
  static getRegisteredSources(): string[] {
    return Object.keys(this.registry);
  }
}

// Convenience functions for direct usage
export const normalizeCryptoData = NormalizerFactory.normalizeData;
export const normalizeCryptoDataWithSource =
  NormalizerFactory.normalizeDataWithSource;
export const detectCryptoDataSource = NormalizerFactory.detectDataSource;
