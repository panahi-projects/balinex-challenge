import { getValidCoinLogo } from "@/shared";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;
    const { searchParams } = new URL(req.url);
    const vsCurrency = searchParams.get("vs_currency") || "usd";

    if (!symbol) {
      return NextResponse.json(
        {
          success: false,
          error: "Symbol parameter is required",
        },
        { status: 400 }
      );
    }

    // Simple mock data for testing
    const mockData = {
      id: symbol.toLowerCase(),
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Coin`,
      image: getValidCoinLogo(symbol),
      // With a 2% chance, generate a number between 10,000 and 10,000,000. Otherwise, between 0 and 10,000.
      currentPrice: `${(Math.random() < 0.02
        ? 10000 + Math.random() * (10000000 - 10000)
        : Math.random() * 10000
      ).toFixed(3)}`,
      marketCap: "1.2T",
      totalVolume: "45.6B",
      priceChangePercentage24h: `${Math.random() > 0.5 ? "+" : "-"}${(Math.random() * 100).toFixed(2)}%`,
      marketCapRank: Math.floor(Math.random() * 1000) + 1,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockData,
      source: "Mock",
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    console.error("Failed to fetch coin details:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cryptocurrency details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
