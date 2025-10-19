import { CryptoTable } from "@/features/crypto-list/components";
import {
  fetchCryptoDataServer,
  cryptoCacheConfig,
} from "@/shared/lib/crypto-server";
import { Suspense } from "react";

export const revalidate = cryptoCacheConfig.revalidate;

export default async function Home() {
  // Fetch initial data server-side
  const initialData = await fetchCryptoDataServer({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 20,
    page: 1,
  });

  return (
    <div className="container text-primary my-4">
      <Suspense
        fallback={
          <div className="text-center py-8 w-full">
            در حال دریافت اطلاعات...
          </div>
        }
      >
        <CryptoTable initialData={initialData} />
      </Suspense>
    </div>
  );
}
