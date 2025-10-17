// hooks/useCryptoData.ts
import { CryptoCurrency } from "@/shared";
import { useState, useEffect } from "react";

interface UseCryptoDataProps {
  vs_currency?: string;
  order?: string;
  per_page?: number;
  page?: number;
  refetchInterval?: number;
}

interface UseCryptoDataReturn {
  data: CryptoCurrency[];
  loading: boolean;
  error: string | null;
  source: string | null;
  lastUpdated: number | null;
  refetch: () => void;
  isRefreshing: boolean;
}

export function useCryptoData({
  vs_currency = "usd",
  order = "market_cap_desc",
  per_page = 100,
  page = 1,
  refetchInterval = 60000, // 1 minute
}: UseCryptoDataProps = {}): UseCryptoDataReturn {
  const [data, setData] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchData = async (isInitialLoad = false) => {
    try {
      // Only show loading state on initial load
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      const queryParams = new URLSearchParams({
        vs_currency,
        order,
        per_page: per_page.toString(),
        page: page.toString(),
      });

      const response = await fetch(`/api/crypto?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setSource(result.source);
        setLastUpdated(result.timestamp);
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Failed to fetch crypto data:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchData(true); // Initial load

    if (refetchInterval > 0) {
      const interval = setInterval(() => fetchData(false), refetchInterval);
      return () => clearInterval(interval);
    }
  }, [vs_currency, order, per_page, page, refetchInterval]);

  return {
    data,
    loading,
    error,
    source,
    lastUpdated,
    refetch: () => fetchData(false),
    isRefreshing,
  };
}
