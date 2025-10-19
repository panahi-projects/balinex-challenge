import { NextResponse } from "next/server";
import { cryptoPriorityAPI } from "@/features/crypto-list";
import { getValidCoinLogoAsync } from "@/shared/lib/coin-logo";
import { cryptoStorage } from "@/shared/lib/crypto-storage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params = {
      vs_currency: searchParams.get("vs_currency") || "usd",
      order: searchParams.get("order") || "market_cap_desc",
      per_page: Number(searchParams.get("per_page")) || 100,
      page: Number(searchParams.get("page")) || 1,
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

    const response = NextResponse.json({
      success: true,
      data: allData,
      source: result.source,
      customCount: customCryptos.length,
      timestamp: result.timestamp,
    });

    // Add caching headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    response.headers.set("CDN-Cache-Control", "max-age=60");
    response.headers.set("Vercel-CDN-Cache-Control", "max-age=60");

    // Add revalidation tag for cache invalidation
    response.headers.set("Cache-Tags", "crypto-data");

    return response;
  } catch (error: unknown) {
    console.error("All crypto data sources failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "All data sources are currently unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
