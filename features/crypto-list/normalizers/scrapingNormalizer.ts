import { CryptoCurrency } from "@/shared";
import { CryptoDataNormalizer, ScrapedCryptoData } from "../types/normalizer";

export class ScrapingNormalizer
  implements CryptoDataNormalizer<ScrapedCryptoData>
{
  normalize(data: ScrapedCryptoData[]): CryptoCurrency[] {
    return data.map((item) => this.normalizeItem(item));
  }

  private normalizeItem(item: ScrapedCryptoData): CryptoCurrency {
    return {
      id: item.id,
      rank: item.rank,
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      price: this.cleanPrice(item.price),
      image: item.image,
      change24h: this.cleanPercentage(item.change24h),
      volume24h: this.cleanVolume(item.volume24h),
      marketCap: item.marketCap
        ? this.cleanMarketCap(item.marketCap)
        : undefined,
    };
  }

  validate(data: ScrapedCryptoData[]): boolean {
    if (!Array.isArray(data)) {
      return false;
    }

    return data.every((item) => {
      return (
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.symbol === "string" &&
        typeof item.price === "string" &&
        typeof item.rank === "string"
      );
    });
  }

  private cleanPrice(price: string): string {
    if (!price || price.trim() === "") {
      return "$0";
    }

    // Remove any non-numeric characters except decimal point and dollar sign
    let cleaned = price.replace(/[^\d.,$]/g, "");

    // If it doesn't start with $, add it
    if (!cleaned.startsWith("$")) {
      cleaned = "$" + cleaned;
    }

    // Handle cases where there might be multiple decimal points
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    return cleaned;
  }

  private cleanPercentage(percentage: string): string {
    if (!percentage || percentage.trim() === "") {
      return "0.00%";
    }

    // Remove any non-numeric characters except decimal point, plus, minus, and percent
    let cleaned = percentage.replace(/[^\d.,+\-%]/g, "");

    // If it doesn't end with %, add it
    if (!cleaned.endsWith("%")) {
      cleaned = cleaned + "%";
    }

    // Ensure there's a sign if it's a positive number
    if (
      !cleaned.startsWith("+") &&
      !cleaned.startsWith("-") &&
      !cleaned.startsWith("0")
    ) {
      cleaned = "+" + cleaned;
    }

    return cleaned;
  }

  private cleanVolume(volume: string): string {
    if (!volume || volume.trim() === "") {
      return "$0";
    }

    // Remove any non-numeric characters except decimal point, dollar sign, and common abbreviations
    let cleaned = volume.replace(/[^\d.,$KMBT]/g, "");

    // If it doesn't start with $, add it
    if (!cleaned.startsWith("$")) {
      cleaned = "$" + cleaned;
    }

    return cleaned;
  }

  private cleanMarketCap(marketCap: string): string {
    if (!marketCap || marketCap.trim() === "") {
      return "$0";
    }

    // Remove any non-numeric characters except decimal point, dollar sign, and common abbreviations
    let cleaned = marketCap.replace(/[^\d.,$KMBT]/g, "");

    // If it doesn't start with $, add it
    if (!cleaned.startsWith("$")) {
      cleaned = "$" + cleaned;
    }

    return cleaned;
  }
}

export const scrapingNormalizer = new ScrapingNormalizer();
