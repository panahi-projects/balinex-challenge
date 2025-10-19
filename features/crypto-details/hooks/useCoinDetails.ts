"use client";
import { useState, useEffect, useCallback } from "react";
import { coinDetailsAPI } from "../services/coinDetailsAPI";
import { type CoinDetailsType, type CoinDetailsResponse } from "../types";

interface UseCoinDetailsProps {
  symbol: string;
  vsCurrency?: string;
  enabled?: boolean;
  initialData?: {
    data: any | null;
    success: boolean;
    error?: string;
    timestamp: number;
  };
}

interface UseCoinDetailsReturn {
  data: CoinDetailsType | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: number | null;
}

export function useCoinDetails({
  symbol,
  vsCurrency = "usd",
  enabled = true,
  initialData,
}: UseCoinDetailsProps): UseCoinDetailsReturn {
  const [data, setData] = useState<CoinDetailsType | null>(
    initialData?.data || null
  );
  const [loading, setLoading] = useState(!initialData?.success && enabled);
  const [error, setError] = useState<string | null>(initialData?.error || null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(
    initialData?.timestamp || null
  );

  const fetchCoinDetails = useCallback(async () => {
    if (!enabled || !symbol) return;

    setLoading(true);
    setError(null);

    try {
      const response: CoinDetailsResponse = await coinDetailsAPI.getCoinDetails(
        symbol,
        vsCurrency
      );

      if (response.success && response.data) {
        setData(response.data);
        setLastUpdated(response.timestamp || Date.now());
      } else {
        setError(response.error || "Failed to fetch coin details");
        setData(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [symbol, vsCurrency, enabled]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    // Only fetch if we don't have initial data or if initial data failed
    if (!initialData?.success) {
      fetchCoinDetails();
    }
  }, [fetchCoinDetails, initialData?.success]);

  const refetch = useCallback(() => {
    fetchCoinDetails();
  }, [fetchCoinDetails]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
  };
}

export function useMultipleCoinDetails({
  symbols,
  vsCurrency = "usd",
  enabled = true,
}: {
  symbols: string[];
  vsCurrency?: string;
  enabled?: boolean;
}) {
  const [data, setData] = useState<CoinDetailsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchMultipleCoinDetails = useCallback(async () => {
    if (!enabled || !symbols.length) return;

    setLoading(true);
    setError(null);

    try {
      const responses = await coinDetailsAPI.getMultipleCoinDetails(
        symbols,
        vsCurrency
      );

      const successfulData = responses
        .filter(
          (
            response
          ): response is CoinDetailsResponse & { data: CoinDetailsType } =>
            response.success && !!response.data
        )
        .map((response) => response.data);

      setData(successfulData);
      setLastUpdated(Date.now());

      // Check if any requests failed
      const failedResponses = responses.filter((response) => !response.success);
      if (failedResponses.length > 0) {
        console.warn("Some coin details failed to fetch:", failedResponses);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [symbols, vsCurrency, enabled]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchMultipleCoinDetails();
  }, [fetchMultipleCoinDetails]);

  const refetch = useCallback(() => {
    fetchMultipleCoinDetails();
  }, [fetchMultipleCoinDetails]);

  return {
    data,
    loading,
    error,
    refetch,
    lastUpdated,
  };
}
