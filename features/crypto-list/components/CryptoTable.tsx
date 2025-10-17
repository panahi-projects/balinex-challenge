"use client";
import { Card, DataTable, formatPrice } from "@/shared";
import type { ActionButton, Column } from "@/shared";
import type { Crypto } from "../types";
import CryptoName from "./CryptoName";
import { CryptoTableColumns } from "../constants";
import CryptoPercentChange from "./CryptoPercentChange";
import { useEffect, useState } from "react";
import { useCryptoData } from "../hooks";

const CryptoTable = () => {
  const columns: Column<Crypto>[] = [
    {
      key: "name",
      title: CryptoTableColumns.NAME as string,
      dataIndex: "name",
      width: "200px",
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
              {formatPrice(value)}
            </span>{" "}
            <span className="text-secondary-text text-sm">تتر</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: "transactionValue",
      title: CryptoTableColumns.TRANSACTION_VALUE as string,
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
            <span className="farsi-number text-bold">{formatPrice(value)}</span>{" "}
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
        console.log(record);
      },
      responsive: {
        mobile: false,
        tablet: true,
        desktop: true,
      },
    },
  ];

  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);

  // const {
  //   data: cryptoData,
  //   loading,
  //   error,
  // } = useCryptoData({
  //   vs_currency: "usd",
  //   order: "market_cap_desc",
  //   per_page: 10,
  //   page: 1,
  // });

  // console.log("loading: ", loading);
  // console.log("error: ", error);
  // console.log("cryptoData: ", cryptoData);

  const [data, _] = useState<Crypto[]>([]);

  // useEffect(() => {
  //   if (cryptoData) {
  //     setData(
  //       cryptoData.map((item) => ({
  //         id: item.id,
  //         name: item.name,
  //         symbol: item.symbol,
  //         price: item.current_price.toString(),
  //         image: item.image,
  //         enable: true,
  //         percentChange: item.price_change_percentage_24h.toFixed(2).toString(),
  //         transactionValue: item.low_24h.toString(),
  //       }))
  //     );
  //   }
  // }, [cryptoData]);

  return (
    <Card>
      <DataTable
        columns={columns}
        data={data}
        actions={actions}
        actionColumnTitle=""
      />
    </Card>
  );
};

export default CryptoTable;
