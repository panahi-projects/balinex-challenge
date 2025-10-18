import { NewCryptoFormData, NewCryptoResponse } from "../types";

export class CryptoNewAPI {
  private static instance: CryptoNewAPI;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = "/api/crypto";
  }

  public static getInstance(): CryptoNewAPI {
    if (!CryptoNewAPI.instance) {
      CryptoNewAPI.instance = new CryptoNewAPI();
    }
    return CryptoNewAPI.instance;
  }

  public async createCrypto(
    data: NewCryptoFormData
  ): Promise<NewCryptoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      return result;
    } catch (error) {
      console.error("Error creating crypto:", error);
      return {
        success: false,
        error: "Failed to create cryptocurrency",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Export singleton instance
export const cryptoNewAPI = CryptoNewAPI.getInstance();
