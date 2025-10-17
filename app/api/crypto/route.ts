import { NextResponse } from "next/server";
// import { scrapeCryptoData } from "@/shared/lib/scraper";
import { cryptoPriorityAPI } from "@/features/crypto-list/services/cryptoAPI";
import { getValidCoinLogoAsync } from "@/shared/lib/coin-logo";

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

    return NextResponse.json({
      success: true,
      data: dataWithValidatedLogos,
      source: result.source,
      timestamp: result.timestamp,
    });
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

// export async function GET(req: Request) {
//   try {
//     const cryptoData = await scrapeCryptoData(
//       "https://coinmarketcap.com/all/views/all/"
//     );
//     return NextResponse.json(cryptoData);
//   } catch (error: any) {
//     console.error("Failed to scrape crypto data:", error);
//     return NextResponse.json(
//       { error: "Failed to scrape crypto data" },
//       { status: 500 }
//     );
//   }
// }
