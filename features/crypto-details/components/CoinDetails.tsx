"use client";
import Image from "next/image";
import { useCoinDetails } from "../hooks";
import { Card, formatPrice } from "@/shared";
import { CoinDetailsProps } from "../types";

const CoinDetails = ({
  symbol,
  vsCurrency = "usd",
  initialData,
}: CoinDetailsProps) => {
  const { data, loading, error, refetch } = useCoinDetails({
    symbol,
    vsCurrency,
    initialData,
  });

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="mr-2">در حال دریافت اطلاعات...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-4">
          <div className="text-red-500 mb-2">خطا: {error}</div>
          <button
            onClick={refetch}
            className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-600"
          >
            تلاش مجدد
          </button>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <div className="text-center py-4">
          <div className="text-gray-500">اطلاعاتی موجود نیست</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={data.image}
          alt={data.name}
          width={64}
          height={64}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-lg font-bold">{data.name}</h2>
          <p className="text-gray-500">{data.symbol}</p>
        </div>
      </div>

      {/* Price Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">قیمت فعلی</p>
          <p className="text-xl font-bold farsi-number">
            ${formatPrice(data.currentPrice)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">تغییر 24 ساعته</p>
          <p
            className={`text-lg font-bold farsi-number ${
              data.priceChangePercentage24h.startsWith("-")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {data.priceChangePercentage24h}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ارزش بازار</p>
          <p className="text-lg font-semibold farsi-number">
            ${data.marketCap}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">حجم معاملات (24h)</p>
          <p className="text-lg font-semibold farsi-number">
            ${data.totalVolume}
          </p>
        </div>
      </div>

      {/* Rank */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-400">
          رده <span className="farsi-number">{data.marketCapRank}</span>#
        </span>
      </div>
    </div>
  );
};

export default CoinDetails;
