"use client";
import { Card, DataTable, formatPrice } from "@/shared";
import { ActionButton, Column } from "@/shared/components/DataTable";

interface Crypto {
  name: string;
  symbol: string;
  price: string;
}

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
      responsive: {
        mobile: true,
        tablet: true,
        desktop: true,
      },
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
  const data = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "100000000",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "3456",
    },
    {
      name: "Cardano",
      symbol: "ADA",
      price: "123456789",
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
