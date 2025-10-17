import { CryptoCurrency } from "@/shared";
import { CryptoDataNormalizer, CoinGeckoCryptoData } from "../types/normalizer";

export class CoinGeckoNormalizer
  implements CryptoDataNormalizer<CoinGeckoCryptoData>
{
  normalize(data: CoinGeckoCryptoData[]): CryptoCurrency[] {
    return data.map((item) => this.normalizeItem(item));
  }

  private normalizeItem(item: CoinGeckoCryptoData): CryptoCurrency {
    return {
      id: item.id,
      rank: item.market_cap_rank?.toString() || "0",
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      price: this.formatPrice(item.current_price),
      image: item.image,
      change24h: this.formatPercentage(item.price_change_percentage_24h),
      volume24h: this.formatVolume(item.total_volume),
      marketCap: this.formatMarketCap(item.market_cap),
    };
  }

  validate(data: CoinGeckoCryptoData[]): boolean {
    if (!Array.isArray(data)) {
      return false;
    }

    return data.every((item) => {
      return (
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.symbol === "string" &&
        typeof item.current_price === "number" &&
        typeof item.image === "string"
      );
    });
  }

  private formatPrice(price: number): string {
    if (price === null || price === undefined || isNaN(price)) {
      return "0";
    }

    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 100) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  }

  private formatPercentage(percentage: number): string {
    if (percentage === null || percentage === undefined || isNaN(percentage)) {
      return "0.00%";
    }

    const sign = percentage >= 0 ? "+" : "";
    return `${sign}${percentage.toFixed(2)}%`;
  }

  private formatVolume(volume: number): string {
    if (volume === null || volume === undefined || isNaN(volume)) {
      return "$0";
    }

    if (volume >= 1e12) {
      return `$${(volume / 1e12).toFixed(2)}T`;
    } else if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    } else {
      return `$${volume.toFixed(2)}`;
    }
  }

  private formatMarketCap(marketCap: number): string {
    if (marketCap === null || marketCap === undefined || isNaN(marketCap)) {
      return "$0";
    }

    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else if (marketCap >= 1e3) {
      return `$${(marketCap / 1e3).toFixed(2)}K`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  }
}

export const coinGeckoNormalizer = new CoinGeckoNormalizer();
