import { NextResponse } from "next/server";
import { scrapeCryptoData } from "@/shared/lib/scraper";

export async function GET(req: Request) {
  try {
    const cryptoData = await scrapeCryptoData(
      "https://coinmarketcap.com/all/views/all/"
    );
    return NextResponse.json(cryptoData);
  } catch (error: any) {
    console.error("Failed to scrape crypto data:", error);
    return NextResponse.json(
      { error: "Failed to scrape crypto data" },
      { status: 500 }
    );
  }
}
