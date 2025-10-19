"use client";
import { useState } from "react";
import { cryptoNewAPI } from "../services/cryptoNewAPI";
import { NewCryptoFormData, NewCryptoResponse } from "../types";
import { useRouter } from "next/navigation";

interface UseCryptoNewReturn {
  createCrypto: (data: NewCryptoFormData) => Promise<NewCryptoResponse>;
  loading: boolean;
  error: string | null;
}

export function useCryptoNew(): UseCryptoNewReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createCrypto = async (
    data: NewCryptoFormData
  ): Promise<NewCryptoResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cryptoNewAPI.createCrypto(data);

      if (!response.success) {
        setError(response.error || "Failed to create cryptocurrency");
      } else {
        // Force a hard refresh to get the latest data from server
        router.refresh();
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    createCrypto,
    loading,
    error,
  };
}
