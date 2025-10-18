import { NextResponse } from "next/server";
import { cryptoStorage } from "@/shared/lib/crypto-storage";
import { NewCryptoFormSchema } from "@/shared/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validationResult = NewCryptoFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.message,
        },
        { status: 400 }
      );
    }

    const newCrypto = validationResult.data;

    // Generate a unique ID for the new crypto
    const id = newCrypto.symbol.toLowerCase();

    // Create the crypto object with default values
    const cryptoData = {
      id,
      symbol: newCrypto.symbol,
      name: newCrypto.name,
      image: newCrypto.image || "/images/coin-placeholder.webp",
      currentPrice: "$0.00",
      marketCap: "0",
      totalVolume: "0",
      priceChangePercentage24h: "0.00%",
      marketCapRank: 999999, // High number to appear at bottom
      lastUpdated: new Date().toISOString(),
      isCustom: true, // Flag to identify custom cryptos
      description: newCrypto.description || "",
      website: newCrypto.website || "",
      twitter: newCrypto.twitter || "",
      github: newCrypto.github || "",
      createdAt: new Date().toISOString(),
    };

    // Store the new crypto
    cryptoStorage.addCrypto(cryptoData);
    return NextResponse.json({
      success: true,
      data: cryptoData,
      message: "Cryptocurrency added successfully",
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    console.error("Failed to create new crypto:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create cryptocurrency",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
