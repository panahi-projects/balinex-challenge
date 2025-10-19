// Simple in-memory storage for custom cryptos
// In a real application, this would be replaced with a database
import { StoredCrypto } from "../types";

class CryptoStorage {
  private static instance: CryptoStorage;
  private customCryptos: StoredCrypto[] = [];

  private constructor() {
    // Load from localStorage if available (client-side)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("custom-cryptos");
      if (stored) {
        try {
          this.customCryptos = JSON.parse(stored);
        } catch (error) {
          console.error("Failed to parse stored cryptos:", error);
          this.customCryptos = [];
        }
      }
    }
  }

  public static getInstance(): CryptoStorage {
    if (!CryptoStorage.instance) {
      CryptoStorage.instance = new CryptoStorage();
    }
    return CryptoStorage.instance;
  }

  public addCrypto(crypto: StoredCrypto): void {
    this.customCryptos.unshift(crypto); // Add to beginning
    this.saveToStorage();
  }

  public getAllCustomCryptos(): StoredCrypto[] {
    return [...this.customCryptos];
  }

  public getCryptoById(id: string): StoredCrypto | undefined {
    return this.customCryptos.find((crypto) => crypto.id === id);
  }

  public removeCrypto(id: string): boolean {
    const index = this.customCryptos.findIndex((crypto) => crypto.id === id);
    if (index > -1) {
      this.customCryptos.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "custom-cryptos",
        JSON.stringify(this.customCryptos)
      );
    }
  }
}

export const cryptoStorage = CryptoStorage.getInstance();
export type { StoredCrypto };
