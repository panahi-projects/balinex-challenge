"use client";
import type { ActionButton, Column, CryptoCurrency } from "@/shared";
import { Card, DataTable } from "@/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CryptoTableColumns } from "../constants";
import { useCryptoData } from "../hooks";
import type { Crypto, CryptoTableProps } from "../types";
import CryptoName from "./CryptoName";
import CryptoPercentChange from "./CryptoPercentChange";
import ViewMoreButton from "./ViewMoreButton";

const CryptoTable = ({ initialData }: CryptoTableProps) => {
  const {
    data: cryptoData,
    loading,
    error,
    lastUpdated,
    refetch,
    isRefreshing,
    loadMore,
    hasMore,
    isLoadingMore,
    totalLoaded,
  } = useCryptoData({
    per_page: 20,
    refetchInterval: 60000, // 60 seconds
    initialData,
  });
  const [data, setData] = useState<Crypto[]>([]);
  const router = useRouter();

  const columns: Column<CryptoCurrency>[] = [
    {
      key: "rank",
      title: "",
      dataIndex: "rank",
      width: "60px",
      align: "center",
      render: (value) => {
        return (
          <span className="text-bold farsi-number text-[12px] md:text-[14px] lg:text-[16px]">
            {value}
          </span>
        );
      },
      responsive: {
        mobile: false,
        tablet: true,
        desktop: true,
      },
    },
    {
      key: "name",
      title: CryptoTableColumns.NAME as string,
      dataIndex: "name",
      width: "250px",
      mobileWidth: "200px",
      align: "right",
      render: (value, record) => (
        <CryptoName
          name={value}
          symbol={record.symbol}
          image={record.image}
          price={record.price}
        />
      ),
    },
    {
      key: "price",
      title: CryptoTableColumns.PRICE as string,
      dataIndex: "price",
      width: "150px",
      align: "right",
      responsive: {
        mobile: true,
        tablet: true,
        desktop: true,
      },
      render: (value) => {
        return (
          <div className="flex items-center gap-2">
            <span className="text-bold farsi-number text-[12px] md:text-[14px] lg:text-[16px]">
              {value}
            </span>{" "}
            <span className="text-secondary-text text-sm">تتر</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: "transactionValue",
      title: CryptoTableColumns.VOLUME_24H as string,
      dataIndex: "transactionValue",
      width: "200px",
      align: "right",
      responsive: {
        mobile: false,
        tablet: true,
        desktop: true,
      },
      render: (value) => {
        return (
          <div className="flex items-center gap-2">
            <span className="farsi-number text-bold">{value}</span>{" "}
            <span className="text-secondary-text text-sm">تتر</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: "percentChange",
      title: CryptoTableColumns.PERCENT_CHANGE as string,
      dataIndex: "percentChange",
      width: "120px",
      align: "right",
      responsive: {
        mobile: false,
        tablet: true,
        desktop: true,
      },
      render: (value) => {
        return <CryptoPercentChange percentChange={value || "0%"} />;
      },
    },
  ];
  const actions: ActionButton<Crypto>[] = [
    {
      label: "خرید و فروش",
      variant: "primary",
      size: "small",
      width: "200px",
      onClick: (record) => {
        router.push(`/crypto/details/${record.symbol}`);
      },
      responsive: {
        mobile: false,
        tablet: true,
        desktop: true,
      },
    },
  ];

  useEffect(() => {
    if (cryptoData) {
      setData(
        cryptoData.map((item) => ({
          id: item.id,
          rank: item.rank,
          name: item.name,
          symbol: item.symbol,
          price: item.price,
          image: item.image,
          enable: true,
          percentChange: item.change24h.toString(),
          transactionValue: item.volume24h,
        }))
      );
    }
  }, [cryptoData]);

  if (loading) {
    return (
      <div className="text-center py-8 w-full">در حال دریافت اطلاعات...</div>
    );
  }
  if (error) {
    return (
      <div>
        <div>خطا: {error}</div>
        <button onClick={refetch}>تلاش مجدد</button>
      </div>
    );
  }
  return (
    <div className="relative">
      <Card>
        {/* Subtle refresh indicator */}
        {isRefreshing && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 shadow-sm">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-blue-600 font-medium">
                به‌روزرسانی...
              </span>
            </div>
          </div>
        )}

        <div className="transition-all duration-500 ease-in-out">
          <DataTable
            columns={columns as Column<Crypto>[]}
            data={data}
            actions={actions}
            actionColumnTitle=""
          />
        </div>

        {/* View More Button */}
        <ViewMoreButton
          onClick={loadMore}
          isLoading={isLoadingMore}
          hasMore={hasMore}
          totalLoaded={totalLoaded}
        />

        {/* Last updated timestamp */}
        {lastUpdated && (
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-500">
              آخرین به‌روزرسانی:{" "}
              {new Date(lastUpdated).toLocaleTimeString("fa-IR")}
              {isRefreshing && (
                <span className="mr-2 text-green-500">
                  (در حال به‌روزرسانی...)
                </span>
              )}
            </span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CryptoTable;
