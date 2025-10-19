import {
  CryptoTable,
  fetchCryptoDataServer,
  cryptoCacheConfig,
} from "@/features/crypto-list";
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>
      <Suspense
        fallback={
          <div
            className="text-center py-8 w-full"
            role="status"
            aria-live="polite"
          >
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
              aria-hidden="true"
            ></div>
            در حال دریافت اطلاعات...
          </div>
        }
      >
        <section id="main-content" aria-label="Cryptocurrency list">
          <CryptoTable initialData={initialData} />
        </section>
      </Suspense>
    </div>
  );
}
