"use client";
import { Card, DataTable } from "@/shared";
import { ActionButton, Column } from "@/shared/components/DataTable";

interface Crypto {
  name: string;
  symbol: string;
}

const CryptoTable = () => {
  const columns: Column<Crypto>[] = [
    {
      key: "name",
      title: "نام بازار",
      dataIndex: "name",
      width: "200px",
      minWidth: "150px",
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
      key: "symbol",
      title: "Symbol",
      dataIndex: "symbol",
      width: "100px",
      minWidth: "80px",
      align: "center",
      responsive: {
        mobile: false,
        tablet: true,
        desktop: true,
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
    },
  ];
  const data = [
    {
      name: "Bitcoin",
      symbol: "BTC",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
    },
    {
      name: "Cardano",
      symbol: "ADA",
    },
  ];
  return (
    <Card>
      <DataTable columns={columns} data={data} actions={actions} />
    </Card>
  );
};

export default CryptoTable;
