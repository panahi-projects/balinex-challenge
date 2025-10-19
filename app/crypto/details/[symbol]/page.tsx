import { CoinDetails } from "@/features/crypto-details/components";
import { Card } from "@/shared";
import BackButton from "@/shared/components/BackButton";
import {
  fetchCryptoDetailsServer,
  cryptoDetailsCacheConfig,
} from "@/shared/lib/crypto-details-server";
import { Suspense } from "react";

export const revalidate = cryptoDetailsCacheConfig.revalidate;

const CryptoDetailsPage = async ({
  params,
}: {
  params: { symbol: string };
}) => {
  const { symbol } = params;

  // Fetch initial data server-side
  const initialData = await fetchCryptoDetailsServer({
    symbol,
    vsCurrency: "usd",
  });

  return (
    <div className="container mx-auto my-4">
      <Card className="relative">
        <div className="absolute top-0 left-0">
          <BackButton />
        </div>
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="mr-2">در حال دریافت اطلاعات...</span>
            </div>
          }
        >
          <CoinDetails symbol={symbol} initialData={initialData} />
        </Suspense>
      </Card>
    </div>
  );
};

export default CryptoDetailsPage;
