"use client";
import { Card, DataTable, formatPrice } from "@/shared";
import type { ActionButton, Column } from "@/shared";
import type { Crypto } from "../types";

const CryptoTable = () => {
  const columns: Column<Crypto>[] = [
    {
      key: "name",
      title: "نام بازار",
      dataIndex: "name",
      minWidth: "100px",
      align: "right",
      render: (value, record) => (
        <div>
          {value} / {record.symbol}
        </div>
      ),
    },
    {
      key: "price",
      title: "آخرین قیمت",
      dataIndex: "price",
      width: "150px",
      minWidth: "120px",
      align: "right",
      responsive: {
        mobile: true,
        tablet: true,
        desktop: true,
      },
      render: (value) => {
        return <div className="farsi-number">{formatPrice(value)}</div>;
      },
    },
  ];
  const actions: ActionButton<Crypto>[] = [
    {
      label: "خرید و فروش",
      variant: "primary",
      size: "small",
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
  const data: Crypto[] = [
    {
      id: "1",
      name: "Bitcoin",
      symbol: "BTC",
      price: "100000000",
      enable: true,
      percentChange: "10%",
      image:
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      transactionValue: "100000000",
    },
    {
      id: "2",
      name: "Ethereum",
      symbol: "ETH",
      price: "3456",
      enable: true,
      percentChange: "0.5%",
      image:
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      transactionValue: "50000000",
    },
    {
      id: "3",
      name: "Cardano",
      symbol: "ADA",
      price: "123456789",
      enable: true,
      percentChange: "2.5%",
      image:
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      transactionValue: "20000000",
    },
  ];
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
