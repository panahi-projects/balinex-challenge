import { useState, useEffect } from "react";
import { getCryptoCoins, CryptoCoin } from "../services/cryptoAPI";

interface UseCryptoDataParams {
  vs_currency: string;
  order?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}

export function useCryptoData(params: UseCryptoDataParams) {
  const [data, setData] = useState<CryptoCoin[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getCryptoCoins(params)
      .then((coins) => {
        if (isMounted) {
          setData(coins);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}
