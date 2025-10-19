// hooks/useCryptoData.ts
import { CryptoCurrency } from "@/shared";
import { useState, useEffect, useCallback, useRef } from "react";

interface UseCryptoDataProps {
  vs_currency?: string;
  order?: string;
  per_page?: number;
  refetchInterval?: number;
  initialData?: {
    data: CryptoCurrency[];
    source: string;
    customCount: number;
    timestamp: number;
    success: boolean;
    error?: string;
  };
}

interface UseCryptoDataReturn {
  data: CryptoCurrency[];
  loading: boolean;
  error: string | null;
  source: string | null;
  lastUpdated: number | null;
  refetch: () => void;
  isRefreshing: boolean;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoadingMore: boolean;
  totalLoaded: number;
}

export function useCryptoData({
  vs_currency = "usd",
  order = "market_cap_desc",
  per_page = 10,
  refetchInterval = 60000, // 1 minute
  initialData,
}: UseCryptoDataProps = {}): UseCryptoDataReturn {
  const [data, setData] = useState<CryptoCurrency[]>(initialData?.data || []);
  const [loading, setLoading] = useState(!initialData?.success);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(initialData?.error || null);
  const [source, setSource] = useState<string | null>(
    initialData?.source || null
  );
  const [lastUpdated, setLastUpdated] = useState<number | null>(
    initialData?.timestamp || null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalLoaded, setTotalLoaded] = useState(
    initialData?.data?.length || 0
  );

  // Ref to store the latest data for background updates
  const dataRef = useRef<CryptoCurrency[]>(initialData?.data || []);
  const currentPageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const fetchData = useCallback(
    async (page: number, isInitialLoad = false, isBackgroundUpdate = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        } else if (isBackgroundUpdate) {
          // Background updates don't show loading states
        } else {
          setIsRefreshing(true);
        }

        if (!isBackgroundUpdate) {
          setError(null);
        }

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
          if (isInitialLoad || isBackgroundUpdate) {
            // For initial load or background update, replace all data
            setData(result.data);
            dataRef.current = result.data;
            setCurrentPage(1);
            currentPageRef.current = 1;
            setTotalLoaded(result.data.length);
            const hasMoreData = result.data.length === per_page;
            setHasMore(hasMoreData);
            hasMoreRef.current = hasMoreData;
          } else {
            // For refresh, replace all data
            setData(result.data);
            dataRef.current = result.data;
            setCurrentPage(1);
            currentPageRef.current = 1;
            setTotalLoaded(result.data.length);
            const hasMoreData = result.data.length === per_page;
            setHasMore(hasMoreData);
            hasMoreRef.current = hasMoreData;
          }

          setSource(result.source);
          setLastUpdated(result.timestamp);
        } else {
          throw new Error(result.error || "Failed to fetch data");
        }
      } catch (err) {
        if (!isBackgroundUpdate) {
          setError(err instanceof Error ? err.message : "An error occurred");
          console.error("Failed to fetch crypto data:", err);
        }
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        } else if (!isBackgroundUpdate) {
          setIsRefreshing(false);
        }
      }
    },
    [vs_currency, order, per_page]
  );

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMoreRef.current) {
      return;
    }

    try {
      setIsLoadingMore(true);
      setError(null);

      const nextPage = currentPageRef.current + 1;

      const queryParams = new URLSearchParams({
        vs_currency,
        order,
        per_page: per_page.toString(),
        page: nextPage.toString(),
      });

      const response = await fetch(`/api/crypto?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        if (result.data.length > 0) {
          // Append new data to existing data
          const newData = [...dataRef.current, ...result.data];
          setData(newData);
          dataRef.current = newData;
          setCurrentPage(nextPage);
          currentPageRef.current = nextPage;
          setTotalLoaded(newData.length);

          // Check if there's more data to load
          const hasMoreData = result.data.length === per_page;
          setHasMore(hasMoreData);
          hasMoreRef.current = hasMoreData;
        } else {
          // No more data
          setHasMore(false);
          hasMoreRef.current = false;
        }
      } else {
        throw new Error(result.error || "Failed to fetch more data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoadingMore(false);
    }
  }, [vs_currency, order, per_page]);

  const refetch = useCallback(() => {
    fetchData(1, false, false);
  }, [fetchData]);

  const refreshAllLoadedPages = useCallback(async () => {
    const totalLoadedPages = currentPageRef.current;

    if (totalLoadedPages <= 1) {
      // If only one page is loaded, just refresh that page
      await fetchData(1, false, true);
      return;
    }

    try {
      // Fetch all pages in parallel
      const pagePromises = [];
      for (let page = 1; page <= totalLoadedPages; page++) {
        const queryParams = new URLSearchParams({
          vs_currency,
          order,
          per_page: per_page.toString(),
          page: page.toString(),
        });

        pagePromises.push(
          fetch(`/api/crypto?${queryParams.toString()}`).then((response) => {
            if (!response.ok) {
              throw new Error(`API responded with status: ${response.status}`);
            }
            return response.json();
          })
        );
      }

      const results = await Promise.all(pagePromises);

      // Combine all data from all pages
      const allData = [];
      for (const result of results) {
        if (result.success && result.data) {
          allData.push(...result.data);
        }
      }

      if (allData.length > 0) {
        // Update the data with all pages
        setData(allData);
        dataRef.current = allData;
        setTotalLoaded(allData.length);

        // Update source and timestamp from the first successful result
        const firstSuccessResult = results.find((r) => r.success);
        if (firstSuccessResult) {
          setSource(firstSuccessResult.source);
          setLastUpdated(firstSuccessResult.timestamp);
        }
      }
    } catch (error) {
      console.error("Failed to refresh all loaded pages:", error);
    }
  }, [vs_currency, order, per_page, fetchData]);

  useEffect(() => {
    // Only fetch if we don't have initial data or if initial data failed
    if (!initialData?.success) {
      fetchData(1, true, false); // Initial load
    }

    if (refetchInterval > 0) {
      const interval = setInterval(() => {
        // Background update - refresh all loaded pages
        refreshAllLoadedPages();
      }, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [
    vs_currency,
    order,
    per_page,
    refetchInterval,
    fetchData,
    refreshAllLoadedPages,
    initialData?.success,
  ]);

  return {
    data,
    loading,
    error,
    source,
    lastUpdated,
    refetch,
    isRefreshing,
    loadMore,
    hasMore,
    isLoadingMore,
    totalLoaded,
  };
}
