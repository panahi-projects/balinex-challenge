import { NextResponse } from "next/server";
import { cryptoStorage } from "@/shared/lib/crypto-storage";

export async function GET() {
  try {
    const customCryptos = cryptoStorage.getAllCustomCryptos();

    // Transform custom cryptos to match CryptoCurrency format
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

    return NextResponse.json({
      success: true,
      data: transformedCustomCryptos,
      count: transformedCustomCryptos.length,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    console.error("Failed to fetch custom cryptos:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch custom cryptocurrencies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
